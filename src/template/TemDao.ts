/**
 * Dao
 */

export let template = `
package com.wdit.modules.community.dao;

import com.google.common.collect.Lists;
import com.wdit.common.mongo.dao.base.MongoBaseDao;
import com.wdit.common.utils.BeanUtil;
import com.wdit.common.utils.BusinessUtil;
import com.wdit.common.utils.StringUtils;
import com.wdit.common.vo.PageVo;
import com.wdit.modules.community.entity.Hotspot;
import com.wdit.modules.entity.community.HotspotEntity;
import com.wdit.modules.entity.community.HotspotForAppVo;
import com.wdit.modules.entity.community.admin.AdminHotspotEntity;
import com.wdit.modules.entity.community.admin.AdminHotspotParamVo;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;

import static org.springframework.data.domain.Sort.Direction.ASC;
import static org.springframework.data.domain.Sort.Direction.DESC;

@Service
public class HotspotDao extends MongoBaseDao<Hotspot> {

    public void updateValue(Hotspot hotspot) {
        if (hotspot == null || StringUtils.isBlank(hotspot.getId())) {
            return;
        }
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(hotspot.getId()));
        Update update = new Update();
        if (StringUtils.isNotBlank(hotspot.getHotspotName())) {
            update.set("name", hotspot.getHotspotName());
        }
        if (StringUtils.isNotBlank(hotspot.getShowType())) {
            update.set("show_type", hotspot.getShowType());
        }
        if (hotspot.getTopLevel() != null && hotspot.getTopLevel() > 0) {
            update.set("top_level", hotspot.getTopLevel());
        }
        update.set("update_date", BusinessUtil.getMongoDate(new Date()));
        mongoTemplate.updateFirst(query, update, Hotspot.class);
    }

    public List<Hotspot> findListForTimer(Hotspot param) {
        String siteId = param.getSiteId();
        String showType = param.getShowType();
        Criteria criteria = new Criteria();
        if (StringUtils.isNotBlank(showType)) {
            criteria.and("show_type").is(showType);
        }
        if (StringUtils.isNotBlank(siteId)) {
            criteria.and("site_id").is(siteId);
        }
        return mongoTemplate.find(Query.query(criteria), getEntityClass());
    }


    public PageVo<AdminHotspotEntity> findPageForAdmin(AdminHotspotParamVo param, Function<Hotspot, AdminHotspotEntity> converter) {
        String siteId = param.getSiteId();
        String showType = param.getShowType();
        String hotspotName = param.getHotspotName();
        Date createBegin = param.getCreateBegin();
        Date createEnd = param.getCreateEnd();
        Criteria criteria = Criteria.where("site_id").is(siteId);
        if (StringUtils.isNotBlank(showType)) {
            criteria.and("show_type").is(showType);
        }
        if (StringUtils.isNotBlank(hotspotName)) {
            criteria.and("hotspot_name").regex(hotspotName);
        }
        if (createBegin != null && createEnd != null) {
            criteria.and("create_date").gte(BusinessUtil.getMongoDate(createBegin))
                    .lte(BusinessUtil.getMongoDate(BusinessUtil.getDayEnd(createEnd)));
        }
        Query query = Query.query(criteria);

        int pageNo = param.getPageNo();
        int pageSize = param.getPageSize();
        String orderBy = param.getOrderBy();
        if (StringUtils.isNotBlank(orderBy)) {
            query.with(new Sort(Objects.equals(param.getDirection(),"DESC")?DESC:ASC, orderBy));
        }else if(BeanUtil.hasFiled(getEntityClass(),"createDate")){
            query.with(new Sort(DESC, "create_date"));
        }
        query.skip((pageNo - 1) * pageSize).limit(pageSize);
        long totalCount = mongoTemplate.count(query, getEntityClass());
        List<AdminHotspotEntity> records = mongoTemplate.find(query, getEntityClass())
                .stream()
                .map(converter)
                .collect(Collectors.toList());

        PageVo<AdminHotspotEntity> result = new PageVo<>();
        result.setRecords(records);
        result.setPageNo(pageNo);
        result.setPageSize(pageSize);
        result.setOrderBy(orderBy);
        result.setTotalCount(totalCount);
        result.setTotalPage((int) (totalCount % pageSize == 0 ? totalCount / pageSize : totalCount / pageSize + 1));
        return result;
    }

    public Hotspot getByName(String siteId, String hotspotName) {
        if (StringUtils.isAnyBlank(siteId, hotspotName)) {
            return null;
        }
        Criteria criteria = Criteria.where("site_id").is(siteId)
                .and("hotspot_name").is(hotspotName);
        return findOne(criteria);
    }

    public void updateCount(String hotspotId, Integer readCount, Integer discussCount) {
        if (StringUtils.isBlank(hotspotId) || readCount == null || discussCount == null) {
            return;
        }
        Query query = Query.query(Criteria.where("_id").is(hotspotId));
        Update update = new Update();
        update.set("read_count", readCount);
        update.set("discuss_count", discussCount);
        mongoTemplate.updateFirst(query, update, Hotspot.class);
    }

    public PageVo<HotspotEntity> findPageForApp(HotspotForAppVo param, Function<Hotspot,HotspotEntity> converter) {
        String siteId = param.getSiteId();
        Integer pageNo = param.getPageNo();
        Integer pageSize = param.getPageSize();
        String hotspotGroupId = param.getHotspotGroupId();
        String keywords = param.getKeywords();

        if (StringUtils.isBlank(siteId) || pageNo == null || pageSize == null) {
            return new PageVo<>();
        }
        Criteria criteria = Criteria.where("show_type").is("0")
                .and("site_id").is(siteId);
        if (StringUtils.isNotBlank(hotspotGroupId)) {
            criteria.and("hotspot_group_id").is(hotspotGroupId);
        }
        if (StringUtils.isNotBlank(keywords)) {
            criteria.and("hotspot_name").regex(keywords);
        }
        Sort sort = Sort.by(DESC, "top_level", "sort");
        return findPage(Query.query(criteria).with(sort), new PageVo<>(pageNo, pageSize),converter);
    }

    public void addClickCount(String siteId, String hotspotId) {
        Query query = Query.query(Criteria.where("site_id").is(siteId)
                .and("_id").is(hotspotId)) ;
        Update update = new Update();
        update.inc("click_count");
        mongoTemplate.updateFirst(query, update, getEntityClass());
    }

    public List<Hotspot> findListByGroupId(String id) {
        if (StringUtils.isBlank(id)) {
            return Lists.newArrayList();
        }
        List<Hotspot> hotspots = mongoTemplate.find(Query.query(Criteria.where("hotspot_group_id").is(id)), getEntityClass());
        return hotspots;
    }


    public void setSortAndContentCount(String id, Integer count) {
        if (StringUtils.isBlank(id) || count == null) {
            return;
        }
        Query query = Query.query(Criteria.where("_id").is(id)) ;
        Update update = new Update();
        update.set("content_count", count);
        update.set("sort", count);
        mongoTemplate.updateFirst(query, update, getEntityClass());
    }
}


`;



