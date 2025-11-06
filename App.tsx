import { useState, useEffect } from 'react';
import { useAuth } from './src/contexts/AuthContext';
import { useSubscription } from './src/hooks/useSubscription';
import { useCourses } from './src/hooks/useCourses';
import SidebarWrapper from './components/SidebarWrapper';
import Header from './components/Header';
import AgentView from './components/AgentView';
import ContentView from './components/ContentView';
import CommunityView from './components/CommunityView';
import VideoPlayerView from './components/VideoPlayerView';
import AdminView from './components/AdminView';
import LandingPage from './components/LandingPage';
import LoginSignup from './components/Auth/LoginSignup';
import SubscriptionPaywall from './components/SubscriptionPaywall';
import type { ViewType, Video, AgentType, HistoryItem, ChatHistory } from './types';

function App() {
  const { user, loading: authLoading } = useAuth();
  const { hasSubscription } = useSubscription();
  const { courses, loading: coursesLoading, error: coursesError } = useCourses({ enabled: !!user });
  const [showLogin, setShowLogin] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('conteudo');
  const [selectedCourse, setSelectedCourse] = useState<{ video: Video; playlist: Video[] } | null>(null);
  
  // Agent state
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);

  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <LandingPage onGetStarted={() => setShowLogin(true)} />
        {showLogin && <LoginSignup onClose={() => setShowLogin(false)} />}
      </>
    );
  }

  const handleViewChange = (view: ViewType) => {
    if (view === 'admin' && user.role !== 'admin') {
      return;
    }
    setCurrentView(view);
    setSelectedCourse(null);
  };

  // Agent history functions
  const addToHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: Date.now(),
      timestamp: new Date().toISOString(),
    };
    setHistory(prev => [newItem, ...prev]);
  };

  const deleteHistoryItem = (id: number) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const clearAgentHistory = (agentType: AgentType) => {
    setHistory(prev => prev.filter(item => item.agentType !== agentType));
  };

  // Chat history functions
  const saveChatHistory = (chat: ChatHistory) => {
    setChatHistories(prev => {
      const existing = prev.find(c => c.id === chat.id);
      if (existing) {
        return prev.map(c => c.id === chat.id ? chat : c);
      }
      return [chat, ...prev];
    });
  };

  const deleteChatHistory = (id: number) => {
    setChatHistories(prev => prev.filter(chat => chat.id !== id));
  };

  const clearAllChatHistory = () => {
    setChatHistories([]);
  };

  const renderContent = () => {
    if (selectedCourse) {
      return <VideoPlayerView 
        initialVideo={selectedCourse.video} 
        playlist={selectedCourse.playlist}
        onBack={() => setSelectedCourse(null)}
      />;
    }

    switch (currentView) {
      case 'agentes':
        return <AgentView 
          history={history}
          addToHistory={addToHistory}
          deleteHistoryItem={deleteHistoryItem}
          clearAgentHistory={clearAgentHistory}
          chatHistories={chatHistories}
          saveChatHistory={saveChatHistory}
          deleteChatHistory={deleteChatHistory}
          clearAllChatHistory={clearAllChatHistory}
        />;
      case 'conteudo':
        if (coursesLoading) {
          return (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-400">Carregando cursos...</p>
              </div>
            </div>
          );
        }
        if (coursesError) {
          return (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-red-400">
                <p>Erro ao carregar cursos: {coursesError}</p>
              </div>
            </div>
          );
        }
        return <ContentView courses={courses} onVideoSelect={(video, playlist) => setSelectedCourse({ video, playlist })} />;
      case 'comunidade':
        return <CommunityView />;
      case 'admin':
        return user.role === 'admin' ? <AdminView /> : <div>Acesso negado</div>;
      default:
        if (coursesLoading) {
          return (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-400">Carregando cursos...</p>
              </div>
            </div>
          );
        }
        return <ContentView courses={courses} onVideoSelect={(video, playlist) => setSelectedCourse({ video, playlist })} />;
    }
  };

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      <SidebarWrapper 
        currentView={currentView}
        onViewChange={handleViewChange}
        isAdmin={user.role === 'admin'}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header currentView={currentView} userName={user.name} />
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>

      {showPaywall && <SubscriptionPaywall onClose={() => setShowPaywall(false)} />}
    </div>
  );
}

export default App;
