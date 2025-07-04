import React, { useEffect, useState } from 'react'
import { View, WebView, Text } from '@tarojs/components'
import { useRouter } from '@tarojs/taro'
import Taro from '@tarojs/taro'
import './index.scss'

const H5Page: React.FC = () => {
  const router = useRouter()
  const [pageUrl, setPageUrl] = useState<string>('')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const { url } = router.params
    
    if (!url) {
      setError('缺少URL参数')
      return
    }

    try {
      const decodedUrl = decodeURIComponent(url)
      setPageUrl(decodedUrl)
      
      // 设置页面标题
      Taro.setNavigationBarTitle({
        title: 'H5页面'
      })
    } catch (err) {
      console.error('URL解码失败:', err)
      setError('URL格式错误')
    }
  }, [router.params])

  if (error) {
    return (
      <View className="h5-page-error">
        <Text className="error-text">{error}</Text>
      </View>
    )
  }

  if (!pageUrl) {
    return (
      <View className="h5-page-loading">
        <Text className="loading-text">加载中...</Text>
      </View>
    )
  }

  return (
    <View className="h5-page">
      <WebView 
        src={pageUrl}
        onMessage={(e) => {
          console.log('WebView消息:', e.detail.data)
        }}
        onLoad={() => {
          console.log('WebView加载完成')
        }}
        onError={(e) => {
          console.error('WebView加载错误:', e.detail)
          setError('页面加载失败')
        }}
      />
    </View>
  )
}

export default H5Page