import React, { useState } from 'react';
import { ChatBubbleIcon, SparklesIcon, ArrowLeftIcon, LightbulbIcon, VideoCameraIcon, ReplicateIcon } from './icons';
import GeminiChatAgent from './agents/GeminiChatAgent';
import OpenAIChatAgent from './agents/OpenAIChatAgent';
import ImageGenerationAgent from './agents/ImageGenerationAgent';
import PromptSpecialistAgent from './agents/PromptSpecialistAgent';
import VideoGenerationAgent from './agents/VideoGenerationAgent';
import ImageReplicatorAgent from './agents/ImageReplicatorAgent';
import type { HistoryItem, AgentType as AgentId, ChatHistory } from '../types';

interface AgentViewProps {
  history: HistoryItem[];
  addToHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
  deleteHistoryItem: (id: number) => void;
  clearAgentHistory: (agentType: AgentId) => void;
  chatHistories: ChatHistory[];
  saveChatHistory: (chat: ChatHistory) => void;
  deleteChatHistory: (id: number) => void;
  clearAllChatHistory: () => void;
}

type AgentComponentProps = {
    onBack: () => void;
    history: HistoryItem[];
    addToHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
    deleteHistoryItem: (id: number) => void;
    clearAgentHistory: (agentType: AgentId) => void;
};

interface Agent {
    id: AgentId | 'chat' | 'openai-chat';
    title: string;
    description: string;
    icon: React.FC<{className?: string}>;
    component: React.FC<any>;
}

const agents: Agent[] = [
    { 
        id: 'chat',
        title: "Chat com Gemini", 
        description: "Converse com o Google Gemini para tirar dúvidas, gerar ideias e muito mais.",
        icon: ChatBubbleIcon,
        component: GeminiChatAgent
    },
    { 
        id: 'openai-chat',
        title: "Chat com GPT", 
        description: "Converse com o GPT da OpenAI, o modelo mais avançado para conversas e análises.",
        icon: ChatBubbleIcon,
        component: OpenAIChatAgent
    },
    {
        id: 'imageReplicator',
        title: "Analisador de Imagem",
        description: "Envie uma imagem e receba um prompt detalhado para recriá-la ou inspirar novas criações.",
        icon: ReplicateIcon,
        component: ImageReplicatorAgent
    },
    { 
        id: 'generator',
        title: "Gerador de Criativos", 
        description: "Crie ou edite imagens a partir de texto usando o modelo Nano Banana.",
        icon: SparklesIcon,
        component: ImageGenerationAgent
    },
    {
        id: 'videoGenerator',
        title: "Gerador de Vídeo",
        description: "Crie vídeos de alta qualidade a partir de texto usando os modelos Veo e Sora.",
        icon: VideoCameraIcon,
        component: VideoGenerationAgent
    },
    {
        id: 'promptSpecialist',
        title: "Especialista em Prompt",
        description: "Transforme ideias simples em prompts detalhados para gerar imagens e vídeos incríveis.",
        icon: LightbulbIcon,
        component: PromptSpecialistAgent
    }
];

const AgentCard: React.FC<{ agent: Agent; onSelect: () => void }> = ({ agent, onSelect }) => (
    <div 
        onClick={onSelect}
        className="bg-zinc-900 p-6 rounded-xl hover:bg-zinc-800 transition-all duration-300 cursor-pointer border border-zinc-800"
    >
        <div className="flex items-center mb-4">
            <div className="p-2 bg-zinc-800 rounded-lg">
                <agent.icon className="w-6 h-6 text-gray-300" />
            </div>
            <h3 className="ml-4 text-lg font-semibold text-gray-100">{agent.title}</h3>
        </div>
        <p className="text-gray-400 text-sm">{agent.description}</p>
    </div>
);

const AgentView: React.FC<AgentViewProps> = (props) => {
    const [activeAgent, setActiveAgent] = useState<AgentId | 'chat' | 'openai-chat' | null>(null);

    const handleSelectAgent = (id: AgentId | 'chat' | 'openai-chat') => {
        setActiveAgent(id);
    };

    const handleBack = () => {
        setActiveAgent(null);
    };

    const ActiveAgentComponent = agents.find(a => a.id === activeAgent)?.component;

    if (activeAgent && ActiveAgentComponent) {
        return <ActiveAgentComponent onBack={handleBack} {...props} />;
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <h2 className="text-3xl font-bold tracking-tight text-white">Agentes de IA</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {agents.map(agent => (
                    <AgentCard key={agent.id} agent={agent} onSelect={() => handleSelectAgent(agent.id)} />
                ))}
            </div>
        </div>
    );
};

export default AgentView;