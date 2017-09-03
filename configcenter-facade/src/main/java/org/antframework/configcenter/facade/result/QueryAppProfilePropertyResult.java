/* 
 * 作者：钟勋 (e-mail:zhongxunking@163.com)
 */

/*
 * 修订记录:
 * @author 钟勋 2017-08-20 14:04 创建
 */
package org.antframework.configcenter.facade.result;

import org.antframework.common.util.facade.AbstractResult;

import java.util.Map;

/**
 * 查询应用在特定环境中的配置result
 */
public class QueryAppProfilePropertyResult extends AbstractResult {
    // 属性（不存在该应用或环境，则返回null）
    private Map<String, String> properties;

    public Map<String, String> getProperties() {
        return properties;
    }

    public void setProperties(Map<String, String> properties) {
        this.properties = properties;
    }
}
