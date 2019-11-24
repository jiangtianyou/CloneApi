/**
 * 查询详情或列表返回
 */

export let template = `

package //pkg;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

@ApiModel(value = "MemberVo")
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class MemberVo{

    @JsonProperty("nickname")
    private String nickname;
    @JsonProperty("address")
    private String address;
}


`;


