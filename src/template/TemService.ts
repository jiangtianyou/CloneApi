/**
 * Controller接口
 */

export let template = `
package com.wdit.modules.community.service;

import com.google.common.collect.Lists;
import com.wdit.common.utils.StringUtils;
import com.wdit.common.vo.PageVo;
import com.wdit.modules.community.dao.HotspotDao;
import com.wdit.modules.community.entity.Hotspot;
import com.wdit.modules.entity.community.HotspotEntity;
import com.wdit.modules.entity.community.HotspotForAppVo;
import com.wdit.modules.entity.community.admin.AdminHotspotEntity;
import com.wdit.modules.entity.community.admin.AdminHotspotParamVo;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HotspotService {

    @Autowired
    private HotspotDao hotspotDao;

    public List<Hotspot> findList() {
        return hotspotDao.queryAll();
    }

    public void save(Hotspot hotspot) {
        hotspotDao.save(hotspot);
    }

    public Hotspot getById(String id) {
        return hotspotDao.queryById(id);
    }

    public void delete(String id) {
        hotspotDao.deleteById(id);
    }

    /**
     * update
     */
    public void update(Hotspot hotspot) {
        hotspotDao.updateValue(hotspot);
    }

    /**
     * 后台话题管理列表
     */
    public PageVo<AdminHotspotEntity> findPageForAdmin(AdminHotspotParamVo param) {
        PageVo<AdminHotspotEntity> page = hotspotDao.findPageForAdmin(param, HotspotService::toAdminEntity);
        return page;
    }


    public List<Hotspot> findListForTimer(Hotspot param) {
        return hotspotDao.findListForTimer(param);
    }


    public PageVo<HotspotEntity> findPageForApp(HotspotForAppVo param) {
        PageVo<HotspotEntity> page = hotspotDao.findPageForApp(param,HotspotService::toAppEntity);
        return page;
    }

    public List<Hotspot> batchGet(List<String> hotspotIdList) {
        if (CollectionUtils.isEmpty(hotspotIdList)) {
            return Lists.newArrayList();
        }
        return hotspotDao.batchGet(hotspotIdList);
    }

    public Hotspot getByName(String siteId, String hotspotName) {
        return hotspotDao.getByName(siteId, hotspotName);
    }

    public void updateCount(String hotspotId, Integer readCount, Integer discussCount) {
        hotspotDao.updateCount(hotspotId, readCount, discussCount);
    }

    public static AdminHotspotEntity toAdminEntity(Hotspot item) {
        AdminHotspotEntity tmp = new AdminHotspotEntity();
        tmp.setId(item.getId());
        tmp.setHotspotName(item.getHotspotName());
        tmp.setSiteId(item.getSiteId());
        tmp.setShowType(item.getShowType());
        tmp.setTopLevel(item.getTopLevel());
        tmp.setSort(item.getSort());
        tmp.setLabelId(item.getLabelId());
        tmp.setHeadImg(item.getHeadImg());
        tmp.setBackgroundImg(item.getBackgroundImg());
        tmp.setDescription(item.getDescription());
        tmp.setHotspotGroupId(item.getHotspotGroupId());
        tmp.setContentCount(item.getContentCount());
        tmp.setReadCount(item.getReadCount());
        tmp.setDiscussCount(item.getDiscussCount());
        tmp.setClickCount(item.getClickCount());
        tmp.setFakeReadCount(item.getFakeReadCount());
        tmp.setShowCountFlg(item.getShowCountFlg());
        tmp.setCreateDate(item.getCreateDate());
        return tmp;
    }

    public static HotspotEntity toAppEntity(Hotspot entity) {
        HotspotEntity tmp = new HotspotEntity();
        tmp.setHotspotId(entity.getId());
        tmp.setHotspotName(entity.getHotspotName());
        tmp.setTopLevel(entity.getTopLevel());
        tmp.setSort(entity.getSort());
        tmp.setHeadImg(entity.getHeadImg());
        tmp.setBackgroundImg(entity.getBackgroundImg());
        tmp.setDescription(entity.getDescription());
        tmp.setHotspotGroupId(entity.getHotspotGroupId());
        tmp.setContentCount(entity.getContentCount());
        tmp.setHotspotGroupId(entity.getHotspotGroupId());
        return tmp;
    }


    public void addClickCount(String siteId, String hotspotId) {
        if (StringUtils.isAnyBlank(siteId, hotspotId)) {
            return ;
        }
        hotspotDao.addClickCount(siteId, hotspotId);
    }

    public List<Hotspot> findListByGroupId(String id) {
        return hotspotDao.findListByGroupId(id);
    }

    public void setSortAndContentCount(String id, Integer count) {
        hotspotDao.setSortAndContentCount(id, count);
    }
}


`;



