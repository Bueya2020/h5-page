import React, { Component } from 'react';
import { View, Text } from '@tarojs/components';
import { Button } from '../../components/ui';
import { Card } from '../../components/ui';
import { openDesignPage, openMallPage, openConstructionPage, openKnowledgePage } from '../../utils/webview';
import './index.scss';

interface HomeProps {}

interface HomeState {
  userInfo: any;
  isLoggedIn: boolean;
}

class Home extends Component<HomeProps, HomeState> {
  constructor(props: HomeProps) {
    super(props);
    this.state = {
      userInfo: null,
      isLoggedIn: false
    };
  }
  componentDidMount() {

    // 页面加载逻辑
  }
  handleNavigateToDesign = () => {
    openDesignPage();
  };

  handleNavigateToMall = () => {
    openMallPage();
  };

  handleNavigateToConstruction = () => {
    openConstructionPage();
  };

  handleNavigateToKnowledge = () => {
    openKnowledgePage();
  };

  render() {
    const { userInfo, isLoggedIn } = this.state;

    return (
      <View className="home-page gradient-bg">
        <View className="home-header fade-in">
          <Text className="home-title">智能设计与施工</Text>
          <Text className="home-subtitle">让家装更简单</Text>
        </View>

        <View className="home-services">
          <Card className="service-card glass-effect card-hover">
            <View className="service-icon">🎨</View>
            <Text className="service-title">智能设计</Text>
            <Text className="service-desc">AI驱动的个性化设计方案</Text>
          </Card>

          <Card className="service-card glass-effect card-hover">
            <View className="service-icon">🛒</View>
            <Text className="service-title">精品商城</Text>
            <Text className="service-desc">优质家居建材一站购齐</Text>
          </Card>

          <Card className="service-card glass-effect card-hover">
            <View className="service-icon">🔨</View>
            <Text className="service-title">专业施工</Text>
            <Text className="service-desc">标准化施工流程管理</Text>
          </Card>

          <Card className="service-card glass-effect card-hover">
            <View className="service-icon">📚</View>
            <Text className="service-title">装修知识</Text>
            <Text className="service-desc">专业装修知识分享</Text>
          </Card>
        </View>

        {isLoggedIn && userInfo &&
        <View className="user-info">
            <Text className="welcome-text">欢迎回来，{userInfo.nickname || userInfo.username}！</Text>
          </View>
        }
      </View>);

  }
}

export default Home;