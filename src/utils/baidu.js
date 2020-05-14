/* eslint-disable */

/**
 * 埋点
 * @param {*} category 监控的目标名称
 * @param {*} action  目标交互动作
 * @param {*} opt_label 一些额外的信息
 * @param {*} opt_value  额外的数值信息
 */
export function baidu_btn(category, action, opt_label, opt_value) {
  _hmt.push(["_trackEvent", category, action, opt_label, opt_value]);
}
