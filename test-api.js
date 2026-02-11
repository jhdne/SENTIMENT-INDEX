/**
 * BWEnews API 连接测试脚本
 * 
 * 使用方法：
 * node test-api.js
 * 
 * 或在浏览器控制台直接运行此代码
 */

async function testBWENewsAPI() {
  console.log('🔍 开始测试 BWEnews API 连接...\n');
  
  const apiUrl = 'https://api.bwe.news/v1/news/latest';
  
  try {
    console.log(`📡 请求地址: ${apiUrl}`);
    console.log('⏳ 发送请求中...\n');
    
    const startTime = Date.now();
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`✅ HTTP状态码: ${response.status} ${response.statusText}`);
    console.log(`⚡ 响应时间: ${duration}ms\n`);
    
    if (!response.ok) {
      throw new Error(`HTTP错误! 状态码: ${response.status}`);
    }
    
    const data = await response.json();
    
    console.log('📦 响应数据结构:');
    console.log(JSON.stringify(data, null, 2).substring(0, 500) + '...\n');
    
    // 分析数据格式
    console.log('🔬 数据格式分析:');
    
    if (data && Array.isArray(data.news)) {
      console.log(`✅ 检测到新闻数组格式`);
      console.log(`📰 新闻数量: ${data.news.length}`);
      
      if (data.news.length > 0) {
        const firstNews = data.news[0];
        console.log('\n📋 第一条新闻示例:');
        console.log(`  标题: ${firstNews.title || firstNews.headline || firstNews.description || '未找到'}`);
        console.log(`  可用字段: ${Object.keys(firstNews).join(', ')}`);
      }
    } else if (data && data.title) {
      console.log(`✅ 检测到单条新闻格式`);
      console.log(`  标题: ${data.title || data.headline || data.description}`);
      console.log(`  可用字段: ${Object.keys(data).join(', ')}`);
    } else {
      console.log('⚠️  未识别的数据格式，请检查API文档');
      console.log('   数据类型:', typeof data);
      console.log('   是否为数组:', Array.isArray(data));
      if (typeof data === 'object') {
        console.log('   顶层字段:', Object.keys(data).join(', '));
      }
    }
    
    console.log('\n✅ API连接测试成功！');
    console.log('💡 提示: 如果数据格式与预期不符，请根据上述信息修改 App.tsx 中的数据解析逻辑\n');
    
    return { success: true, data };
    
  } catch (error) {
    console.error('\n❌ API连接测试失败:');
    console.error(`   错误类型: ${error.name}`);
    console.error(`   错误信息: ${error.message}`);
    
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      console.error('\n🔧 可能的原因:');
      console.error('   1. API地址不正确或服务不可用');
      console.error('   2. 网络连接问题');
      console.error('   3. CORS跨域限制（浏览器环境）');
      console.error('\n💡 解决方案:');
      console.error('   - 检查API地址是否正确');
      console.error('   - 确认网络连接正常');
      console.error('   - 如果是CORS问题，需要配置代理或联系API提供商');
    } else if (error.message.includes('404')) {
      console.error('\n🔧 API端点不存在，请检查URL是否正确');
    } else if (error.message.includes('401') || error.message.includes('403')) {
      console.error('\n🔧 需要API认证，请添加API密钥到请求头');
    } else if (error.message.includes('429')) {
      console.error('\n🔧 请求频率过高，请稍后再试');
    }
    
    console.error('\n📝 当前配置:');
    console.error(`   API地址: ${apiUrl}`);
    console.error('   请求方法: GET');
    console.error('   请求头: Accept: application/json\n');
    
    return { success: false, error };
  }
}

// 如果在Node.js环境运行
if (typeof window === 'undefined') {
  // Node.js环境需要安装node-fetch
  console.log('⚠️  检测到Node.js环境');
  console.log('💡 如果遇到错误，请安装node-fetch:');
  console.log('   npm install node-fetch\n');
  
  testBWENewsAPI().then(result => {
    if (result.success) {
      console.log('🎉 测试完成！可以开始使用API了。');
      process.exit(0);
    } else {
      console.log('⚠️  测试失败，系统将使用本地模拟数据作为备份。');
      process.exit(1);
    }
  });
} else {
  // 浏览器环境
  console.log('🌐 检测到浏览器环境，开始测试...\n');
  testBWENewsAPI();
}

// 导出供浏览器控制台使用
if (typeof window !== 'undefined') {
  window.testBWENewsAPI = testBWENewsAPI;
  console.log('💡 提示: 可以在控制台运行 testBWENewsAPI() 重新测试');
}

