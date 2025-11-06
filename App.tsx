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
import type { ViewType, Video, AgentType } from './types';

function App() {
  const { user, loading: authLoading } = useAuth();
  const { hasSubscription } = useSubscription();
  const { courses, loading: coursesLoading, error: coursesError } = useCourses({ enabled: !!user });
  const [showLogin, setShowLogin] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('conteudo');
  const [selectedAgent, setSelectedAgent] = useState<AgentType | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<{ video: Video; playlist: Video[] } | null>(null);

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

  const handleAgentSelect = (agent: AgentType) => {
    if (!hasSubscription) {
      setShowPaywall(true);
      return;
    }
    setSelectedAgent(agent);
    setCurrentView('agentes');
  };

  const handleViewChange = (view: ViewType) => {
    if (view === 'admin' && user.role !== 'admin') {
      return;
    }
    setCurrentView(view);
    setSelectedAgent(null);
    setSelectedCourse(null);
  };

  const renderContent = () => {
    if (selectedCourse) {
      return <VideoPlayerView 
        video={selectedCourse.video} 
        playlist={selectedCourse.playlist}
        onBack={() => setSelectedCourse(null)}
      />;
    }

    switch (currentView) {
      case 'agentes':
        return selectedAgent ? (
          <AgentView 
            agentType={selectedAgent}
            onBack={() => setSelectedAgent(null)}
          />
        ) : (
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">Selecione um Agente</h2>
            <p className="text-gray-400">Escolha um agente no menu lateral</p>
          </div>
        );
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
        onAgentSelect={handleAgentSelect}
        selectedAgent={selectedAgent}
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
