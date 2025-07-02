/**
 * 将对象转换为FormData
 * @param data 要转换的对象
 * @returns FormData实例
 */
export function objectToFormData(data: Record<string, any>): FormData {
    const formData = new FormData();
    
    for (const [key, value] of Object.entries(data)) {
        if (value !== null && value !== undefined) {
            formData.append(key, value.toString());
        }
    }
    
    return formData;
}

/**
 * 将对象转换为FormData，支持嵌套对象
 * @param data 要转换的对象
 * @returns FormData实例
 */
export function objectToFormDataDeep(data: Record<string, any>): FormData {
    const formData = new FormData();
    
    function appendValue(key: string, value: any) {
        if (value === null || value === undefined) {
            return;
        }
        
        if (typeof value === 'object' && !Array.isArray(value)) {
            // 递归处理嵌套对象
            for (const [nestedKey, nestedValue] of Object.entries(value)) {
                appendValue(`${key}.${nestedKey}`, nestedValue);
            }
        } else if (Array.isArray(value)) {
            // 处理数组
            value.forEach((item, index) => {
                appendValue(`${key}[${index}]`, item);
            });
        } else {
            formData.append(key, value.toString());
        }
    }
    
    for (const [key, value] of Object.entries(data)) {
        appendValue(key, value);
    }
    
    return formData;
} 