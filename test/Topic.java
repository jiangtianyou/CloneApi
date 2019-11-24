package com.wdit.modules.community.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.IndexDirection;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.List;

/**
 * 热点圈子
 */
@Document(collection = "community_hotspot")
public class Hotspot {

	@Id
	private String id;

	@Field("hotspot_name")
	@NotNull
	private String hotspotName;

	@Field("site_id")
	@NotNull
	private String siteId;

	@Field("show_type")
	@NotNull
	private String showType = "0"; // 0默认显示 1不显示

	@Field("top_level")
	@Indexed(name = "idx_hotspot_top_level", direction = IndexDirection.DESCENDING) // 索引
	@NotNull
	private Integer topLevel = 0; //大的排前面-置顶 默认0  0：正常 大于1：强制置顶

	@Field("sort")
	@Indexed(name = "idx_hotspot_sort", direction = IndexDirection.DESCENDING) // 索引
	@NotNull
	private Integer sort = 0; //大的排前面-排序 默认0（目前规则：审核过后 定时任务计算赋值：文章数量）

	@Field("label_id")
	private String labelId; // 标签Id

	@Field("head_img")
	private String headImg; // 头像

	@Field("background_img")
	private String backgroundImg; // 背景图

	@Field("description")
	private String description; // 描述

	@Field("content_count")
	private Integer contentCount = 0; // 文章数量

	@Field("click_count")
	private Integer clickCount = 0; // 直接圈子列表点击进来的count + 各个文章的点击数

	@Field("read_count")
	private Integer readCount = 0; // 真实阅读数 默认0   --定时任务统计

	@Field("discuss_count")
	private Integer discussCount = 0; // 文章回复数量 --定时任务统计，

	@Field("fake_read_count")
	private Integer fakeReadCount = 0; // 假的阅读数 默认0   -需要作假时加上该数量

	@Field("show_count_flg")
	private String showCountFlg = "0";  // 前台展示数量开关，0默认显示真实 1显示fake+真实数量

	@Field("hotspot_group_Id")
	private String hotspotGroupId; // 所属圈子聚合ID，一个圈子只属于一个聚合

	@Field("create_date")
	private Date createDate;


	// -----------------------------------------------------------------------------
	// -----------------------------------------------------------------------------
	// -----------------------------------------------------------------------------
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getHotspotName() {
		return hotspotName;
	}

	public void setHotspotName(String hotspotName) {
		this.hotspotName = hotspotName;
	}

	public String getSiteId() {
		return siteId;
	}

	public void setSiteId(String siteId) {
		this.siteId = siteId;
	}

	public String getShowType() {
		return showType;
	}

	public void setShowType(String showType) {
		this.showType = showType;
	}

	public Integer getTopLevel() {
		return topLevel;
	}

	public void setTopLevel(Integer topLevel) {
		this.topLevel = topLevel;
	}

	public Integer getSort() {
		return sort;
	}

	public void setSort(Integer sort) {
		this.sort = sort;
	}

	public String getLabelId() {
		return labelId;
	}

	public void setLabelId(String labelId) {
		this.labelId = labelId;
	}

	public String getHeadImg() {
		return headImg;
	}

	public void setHeadImg(String headImg) {
		this.headImg = headImg;
	}

	public String getBackgroundImg() {
		return backgroundImg;
	}

	public void setBackgroundImg(String backgroundImg) {
		this.backgroundImg = backgroundImg;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Integer getReadCount() {
		return readCount;
	}

	public void setReadCount(Integer readCount) {
		this.readCount = readCount;
	}

	public Integer getDiscussCount() {
		return discussCount;
	}

	public void setDiscussCount(Integer discussCount) {
		this.discussCount = discussCount;
	}

	public Integer getFakeReadCount() {
		return fakeReadCount;
	}

	public void setFakeReadCount(Integer fakeReadCount) {
		this.fakeReadCount = fakeReadCount;
	}

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public String getShowCountFlg() {
		return showCountFlg;
	}

	public void setShowCountFlg(String showCountFlg) {
		this.showCountFlg = showCountFlg;
	}

	public Integer getClickCount() {
		return clickCount;
	}

	public void setClickCount(Integer clickCount) {
		this.clickCount = clickCount;
	}

	public Integer getContentCount() {
		return contentCount;
	}

	public void setContentCount(Integer contentCount) {
		this.contentCount = contentCount;
	}

	public String getHotspotGroupId() {
		return hotspotGroupId;
	}

	public void setHotspotGroupId(String hotspotGroupId) {
		this.hotspotGroupId = hotspotGroupId;
	}
}
