import {Toast} from 'vant';
class Utils{
    // 验证表单
    validateForm(val){
        for(let key in val){
            if(!val[key].reg.test(val[key].value)){
                Toast({
                    message:val[key].error,
                    duration:3000,
                    forbidClick:true
                });
                return false;
            }
        }
        // 表单验证通过
        return true;
    }
}
export const utils = new Utils();