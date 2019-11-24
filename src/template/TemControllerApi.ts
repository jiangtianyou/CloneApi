/**
 * Controller接口
 */

export let template = `
package com.wdit.modules.api.community.admin;

import com.wdit.common.msg.ReturnMsg;
import com.wdit.common.vo.PageVo;
import com.wdit.modules.entity.community.admin.AdminHotspotEntity;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Date;

@Api(value = "话题后台接口")
public interface AdminHotspotApi {

    @ApiOperation(value = "获取列表")
    @PostMapping(value = "/api/community/hotspot/list")
    ReturnMsg<PageVo<AdminHotspotEntity>> list(
            @RequestParam(value = "pageNo") @NotNull Integer pageNo,
            @RequestParam(value = "pageSize") @NotNull Integer pageSize,
            @RequestParam(value = "siteId") @NotBlank String siteId,
            @RequestParam(value = "showType", required = false) String showType,
            @RequestParam(value = "hotspotName", required = false) String hotspotName,
            @RequestParam(value = "createBegin", required = false) Date createBegin,
            @RequestParam(value = "createEnd", required = false) Date createEnd,
            @RequestParam(value = "orderBy", required = false) String orderBy,
            @RequestParam(value = "direction", required = false) String direction
    );
    @ApiOperation(value = "新增")
    @PostMapping(value = "/api/community/hotspot/insert")
    ReturnMsg<Object> insert(@RequestParam("siteId") @NotBlank String siteId,
                             @RequestParam("hotspotName") @NotBlank String hotspotName,
                             @RequestParam("showType") @NotBlank String showType,
                             @RequestParam(value = "topLevel", required = false) Integer topLevel,
                             @RequestParam(value = "sort", required = false) Integer sort,
                             @RequestParam(value = "labelId", required = false) String labelId,
                             @RequestParam(value = "headImg", required = false) @NotBlank String headImg,
                             @RequestParam(value = "backgroundImg", required = false) String backgroundImg,
                             @RequestParam(value = "description") @NotBlank String description,
                             @RequestParam(value = "showCountFlg") @NotBlank String showCountFlg,
                             @RequestParam(value = "fakeReadCount", required = false) Integer fakeReadCount,
                             @RequestParam(value = "hotspotGroupId") @NotBlank String hotspotGroupId
    );


    @ApiOperation(value = "更新")
    @PostMapping(value = "/api/community/hotspot/update")
    ReturnMsg<Object> update(
            @RequestParam("id") @NotBlank String id,
            @RequestParam("siteId") @NotBlank String siteId,
            @RequestParam(value = "hotspotName",required = false)String hotspotName,
            @RequestParam(value = "showType",required = false)String showType,
            @RequestParam(value = "topLevel", required = false) Integer topLevel,
            @RequestParam(value = "sort", required = false) Integer sort,
            @RequestParam(value = "labelId", required = false) String labelId,
            @RequestParam(value = "headImg", required = false) String headImg,
            @RequestParam(value = "backgroundImg", required = false) String backgroundImg,
            @RequestParam(value = "description",required = false) String description,
            @RequestParam(value = "showCountFlg",required = false) String showCountFlg,
            @RequestParam(value = "fakeReadCount", required = false) Integer fakeReadCount,
            @RequestParam(value = "hotspotGroupId", required = false) String hotspotGroupId
    );

    @ApiOperation(value = "删除")
    @PostMapping(value = "/api/community/hotspot/delete")
    ReturnMsg<Object> delete(
            @RequestParam("id") @NotBlank String id
    );


    @ApiOperation(value = "详情")
    @PostMapping(value = "/api/community/hotspot/detail")
    ReturnMsg<AdminHotspotEntity> detail(@RequestParam("siteId") @NotBlank String siteId, @RequestParam("id") @NotBlank String id);


}


`;



