/**
 * Controller接口
 */

export let template = `
package com.wdit.modules.community.controller.admin;

import com.wdit.autoconfigure.RabbitMqConfig;
import com.wdit.common.msg.ReturnMsg;
import com.wdit.common.rabbitmq.producer.MsgProducer;
import com.wdit.common.utils.BusinessUtil;
import com.wdit.common.utils.EntitySetter;
import com.wdit.common.utils.JsonUtils;
import com.wdit.common.utils.StringUtils;
import com.wdit.common.vo.PageVo;
import com.wdit.modules.api.community.admin.AdminHotspotApi;
import com.wdit.modules.base.controller.CommunityBaseController;
import com.wdit.modules.community.entity.Hotspot;
import com.wdit.modules.community.entity.Label;
import com.wdit.modules.community.service.CommunityContentService;
import com.wdit.modules.community.service.HotspotGroupService;
import com.wdit.modules.community.service.HotspotService;
import com.wdit.modules.community.service.LabelService;
import com.wdit.modules.entity.community.MqMsgEntity;
import com.wdit.modules.entity.community.admin.AdminHotspotEntity;
import com.wdit.modules.entity.community.admin.AdminHotspotParamVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.*;

import static org.apache.commons.lang3.StringUtils.isNotBlank;

@RestController
@Validated
public class AdminHotspotController extends CommunityBaseController implements AdminHotspotApi {

    @Autowired
    HotspotService hotspotService;
    @Autowired
    LabelService labelService;
    @Autowired
    CommunityContentService communityContentService;
    @Autowired
    private MsgProducer msgProducer;
    @Autowired
    private HotspotGroupService hotspotGroupService;

    @Override
    public ReturnMsg<PageVo<AdminHotspotEntity>> list(@NotNull Integer pageNo,
                                                      @NotNull Integer pageSize,
                                                      @NotBlank String siteId,
                                                      String showType,
                                                      String hotspotName,
                                                      Date createBegin,
                                                      Date createEnd,
                                                      String  orderBy,
                                                      String  direction) {
        AdminHotspotParamVo paramVo = new AdminHotspotParamVo(siteId,showType, hotspotName,
                pageNo, pageSize, createBegin, createEnd,orderBy,direction);
        PageVo<AdminHotspotEntity> page = hotspotService.findPageForAdmin(paramVo);
        return successResult(page);
    }

    @Override
    public ReturnMsg<Object> insert(@NotBlank String siteId, @NotBlank String hotspotName, @NotBlank String showType,Integer topLevel,Integer sort,
                                    String labelId, @NotBlank String headImg,String backgroundImg,  @NotBlank String description, @NotBlank String showCountFlg,
                                   Integer fakeReadCount,@NotBlank String hotspotGroupId) {
        List<String> valueScope = Arrays.asList("0", "1");
        if (!valueScope.contains(showCountFlg)) {
            return failResult("showCountFlg值错误");
        }
        if (!valueScope.contains(showType)) {
            return failResult("showType错误");
        }
        if (isNotBlank(labelId)) {
            Label label = labelService.queryById(labelId);
            if (label == null) {
                return failResult("标签id不存在");
            }
        }
        if (StringUtils.isNotEmpty(hotspotName) && hotspotName.length() > 50) {
            return failResult("圈子名过长");
        }
        Hotspot hotspot = hotspotService.getByName(siteId, hotspotName.trim());
        if (hotspot != null) {
            return failResult(String.format("圈子[%s]已存在", hotspot.getHotspotName()));
        }
        if (hotspotGroupService.getById(hotspotGroupId) == null) {
            return failResult("hotspotGroupId不存在");
        }
        Hotspot entity = new EntitySetter<>(Hotspot::new)
                .set(Hotspot::setId, BusinessUtil.getMongoRandomId())
                .set(Hotspot::setSiteId, siteId)
                .set(Hotspot::setHotspotName, hotspotName)
                .set(Hotspot::setShowType, showType)
                .setOrDefault(Hotspot::setTopLevel, topLevel,0)
                .setOrDefault(Hotspot::setSort, sort,0)
                .setOrDefault(Hotspot::setLabelId, labelId,"")
                .setOrDefault(Hotspot::setHeadImg, headImg,"")
                .setOrDefault(Hotspot::setBackgroundImg, backgroundImg,"")
                .set(Hotspot::setDescription, description)
                .set(Hotspot::setShowCountFlg, showCountFlg)
                .set(Hotspot::setDiscussCount, 0)
                .setOrDefault(Hotspot::setFakeReadCount, fakeReadCount,0)
                .setOrDefault(Hotspot::setHotspotGroupId, hotspotGroupId,"")
                .set(Hotspot::setClickCount, 0)
                .set(Hotspot::setReadCount, 0)
                .set(Hotspot::setContentCount, 0)
                .set(Hotspot::setCreateDate, BusinessUtil.getMongoDate(new Date()))
                .done();
        hotspotService.save(entity);
        return successResult(entity.getId());
    }

    @Override
    public ReturnMsg<Object> update(@NotBlank String id, @NotBlank String siteId, String hotspotName, String showType,
                                    Integer topLevel, Integer sort, String labelId, String headImg, String backgroundImg,
                                    String description, String showCountFlg, Integer fakeReadCount, String hotspotGroupId) {

        List<String> valueScope = Arrays.asList("0", "1");
        if (isNotBlank(showCountFlg)) {
            if (!valueScope.contains(showCountFlg)) {
                return failResult("showCountFlg值错误");
            }
        }
        if (isNotBlank(showType)) {
            if (!valueScope.contains(showType)) {
                return failResult("showType错误");
            }
        }
        if (isNotBlank(labelId)) {
            Label label = labelService.queryById(labelId);
            if (label == null) {
                return failResult("标签id不存在");
            }
        }
        if (StringUtils.isNotEmpty(hotspotName) && hotspotName.length() > 50) {
            return failResult("圈子名过长");
        }
        Hotspot entity = hotspotService.getById(id);
        if (entity == null) {
            return failResult("找不到圈子");
        }
        if (isNotBlank(hotspotGroupId)) {
            if (hotspotGroupService.getById(hotspotGroupId) == null) {
                return failResult("hotspotGroupId不存在");
            }
        }
        if (isNotBlank(hotspotName)) {
            Hotspot hotspot = hotspotService.getByName(siteId, hotspotName.trim());
            if (hotspot != null && !Objects.equals(hotspot.getId(), entity.getId())) {
                return failResult(String.format("圈子[%s]已存在", hotspotName));
            }
            // 圈子名称 并且 变更的圈子名称与之前的不一样 发MQ通知
            if (!Objects.equals(hotspotName, entity.getHotspotName())) {
                // 99:圈子名称变更
                String msg = JsonUtils.toJson(new MqMsgEntity(entity.getId(), siteId, "99"));
                msgProducer.sendTextMessage(RabbitMqConfig.COMMUNITY_EXCHANGE, RabbitMqConfig.ROUTINGKEY_QUEUE_COMMUNITY_SYNCHRO, msg);
            }
        }

        new EntitySetter<>(entity)
                .setIfNotNull(Hotspot::setHotspotName, hotspotName)
                .setIfNotNull(Hotspot::setShowType, showType)
                .setIfNotNull(Hotspot::setTopLevel, topLevel)
                .setIfNotNull(Hotspot::setSort, sort)
                .setIfNotNull(Hotspot::setLabelId, labelId)
                .setIfNotNull(Hotspot::setHeadImg, headImg)
                .setIfNotNull(Hotspot::setBackgroundImg, backgroundImg)
                .setIfNotNull(Hotspot::setDescription, description)
                .setIfNotNull(Hotspot::setShowCountFlg, showCountFlg)
                .setIfNotNull(Hotspot::setFakeReadCount, fakeReadCount)
                .setIfNotNull(Hotspot::setHotspotGroupId, hotspotGroupId);
        hotspotService.save(entity);
        return successResult();
    }

    @Override
    public ReturnMsg<Object> delete(@NotBlank String id) {
        // 判断圈子下是否有稿件
        Integer count = communityContentService.getCountByHotSpotId(id);
        if (count > 0) {
            return failResult("该圈子下已有稿件不能删除");
        }
        hotspotService.delete(id);
        return successResult();
    }

    @Override
    public ReturnMsg<AdminHotspotEntity> detail(@NotBlank String siteId,@NotBlank String id) {
        Hotspot entity = hotspotService.getById(id);
        if (entity == null) {
            return failResult("找不到圈子");
        }
        AdminHotspotEntity result = HotspotService.toAdminEntity(entity);
        return successResult(result);
    }


}



`;



