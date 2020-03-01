/**
 * @copyright 2018 @ ZiniMedia Ltd. Co
 * @author baonguyen
 * @create 2020/03/05 11:51
 * @update 2020/03/05 16:54
 * @file api/utils/rand-string.js
 */

/**
 * @copyright 2018 @ ZiniMedia Ltd. Co
 * @author baonguyen
 * @create 2017/12/03 03:05
 * @update 2017/12/03 03:05
 * @file utils/is-json.js
 */
'use strict';

const isJsonString = (str) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
};

module.exports = isJsonString;