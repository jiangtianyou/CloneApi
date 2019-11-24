/**
 * 查询详情或列表返回
 */

export let template = `
package com.wdit.modules.entity.community.admin;

import java.util.Date;

public class AdminHotspotParamVo {
    private String siteId;
    private String showType;
    private String hotspotName;
    private Integer pageNo;
    private Integer pageSize;
    private Date createBegin;
    private Date createEnd;
    private String orderBy;
    private String direction;
    
    public AdminHotspotParamVo(String siteId, String showType, String hotspotName, Integer pageNo,
                             Integer pageSize, Date createBegin, Date createEnd,String orderBy,String direction) {
        this.siteId = siteId;
        this.showType = showType;
        this.hotspotName = hotspotName;
        this.pageNo = pageNo;
        this.pageSize = pageSize;
        this.createBegin = createBegin;
        this.createEnd = createEnd;
        this.orderBy = orderBy;
        this.direction = direction;
    }
    
    public String getSiteId() {
        return siteId;
    }
    
    public void setSiteId(String siteId) {
        this.siteId = siteId;
    }
    
    public Integer getPageNo() {
        return pageNo;
    }
    
    public void setPageNo(Integer pageNo) {
        this.pageNo = pageNo;
    }
    
    public Integer getPageSize() {
        return pageSize;
    }
    
    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }
    
    public String getShowType() {
        return showType;
    }
    
    public void setShowType(String showType) {
        this.showType = showType;
    }
    
    public Date getCreateBegin() {
        return createBegin;
    }
    
    public void setCreateBegin(Date createBegin) {
        this.createBegin = createBegin;
    }
    
    public Date getCreateEnd() {
        return createEnd;
    }
    
    public void setCreateEnd(Date createEnd) {
        this.createEnd = createEnd;
    }
    
    public String getHotspotName() {
        return hotspotName;
    }
    
    public void setHotspotName(String hotspotName) {
        this.hotspotName = hotspotName;
    }
    
    public String getOrderBy() {
        return orderBy;
    }
    
    public void setOrderBy(String orderBy) {
        this.orderBy = orderBy;
    }
    
    public String getDirection() {
        return direction;
    }
    
    public void setDirection(String direction) {
        this.direction = direction;
    }
}

`;


