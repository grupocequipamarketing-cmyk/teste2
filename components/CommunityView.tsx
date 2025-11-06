import React, { useState } from 'react';
import { DiscordIcon, HeartIcon, HeartIconSolid, PinIcon } from './icons';
import type { User, Post, Comment } from '../types';
import { useAuth } from '@/src/contexts/AuthContext';

const ChatBubbleIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

interface PostCardProps {
    post: Post;
    onLikeToggle: (id: number) => void;
    onPinToggle: (id: number) => void;
    onAddComment: (postId: number, content: string) => void;
    currentUser: User;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLikeToggle, onPinToggle, onAddComment, currentUser }) => {
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    
    const handleSubmitComment = () => {
        if (newComment.trim()) {
            onAddComment(post.id, newComment);
            setNewComment('');
        }
    };
    
    return (
        <div className={`bg-black p-5 rounded-xl border ${post.pinned ? 'border-yellow-500/50' : 'border-zinc-800'} animate-fade-in-up transition-colors`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full" />
                    <div className="ml-3">
                        <p className="font-semibold text-gray-100">{post.author}</p>
                        <p className="text-xs text-gray-400">{post.time}</p>
                    </div>
                </div>
                {post.pinned && (
                    <div className="flex items-center text-yellow-500 text-xs font-semibold">
                        <PinIcon className="w-4 h-4 mr-1.5" />
                        <span>FIXADO</span>
                    </div>
                )}
            </div>
            {post.content && <p className="text-gray-300 whitespace-pre-wrap">{post.content}</p>}
            
            {post.imageUrls && post.imageUrls.length > 0 && (
                 <div className={`mt-4 grid gap-2 ${
                    post.imageUrls.length > 1 ? 'grid-cols-2' : 'grid-cols-1'
                } ${
                    post.imageUrls.length === 3 ? '[&>*:first-child]:col-span-2' : ''
                }`}>
                    {post.imageUrls.map((url, index) => (
                        <div key={index} className="relative group rounded-lg overflow-hidden border border-zinc-800">
                           <img 
                                src={url} 
                                alt={`Anexo ${index + 1} da publicação`} 
                                className={`w-full object-cover ${post.imageUrls?.length === 3 && index === 0 ? 'aspect-video' : 'aspect-square'}`}
                            />
                       </div>
                   ))}
                </div>
            )}

            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-4">
                    <button 
                        onClick={() => onLikeToggle(post.id)}
                        className={`flex items-center text-sm transition-colors p-1 -m-1 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500 ${post.liked ? 'text-red-500 hover:text-red-400' : 'text-gray-400 hover:text-white'}`}
                    >
                        {post.liked ? <HeartIconSolid className="w-5 h-5 mr-1.5" /> : <HeartIcon className="w-5 h-5 mr-1.5" />}
                        {post.likes}
                    </button>
                    <button 
                        onClick={() => setShowComments(!showComments)}
                        className="flex items-center text-sm text-gray-400 hover:text-white p-1 -m-1 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500 transition-colors"
                    >
                        <ChatBubbleIcon className="w-5 h-5 mr-1.5" />
                        {post.comments?.length || 0}
                    </button>
                </div>

                {currentUser.role === 'admin' && (
                    <button
                        onClick={() => onPinToggle(post.id)}
                        className="flex items-center text-sm text-gray-400 hover:text-white p-1 -m-1 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500 transition-colors"
                        title={post.pinned ? 'Desafixar Recado' : 'Fixar Recado'}
                    >
                        <PinIcon className={`w-5 h-5 transition-colors ${post.pinned ? 'text-yellow-500' : 'text-gray-500 hover:text-yellow-500'}`} />
                    </button>
                )}
            </div>
            
            {showComments && (
                <div className="mt-4 pt-4 border-t border-zinc-800 space-y-4">
                    {post.comments && post.comments.length > 0 && (
                        <div className="space-y-3">
                            {post.comments.map(comment => (
                                <div key={comment.id} className="flex gap-3">
                                    <img src={comment.avatar} alt={comment.author} className="w-8 h-8 rounded-full shrink-0" />
                                    <div className="flex-1 bg-zinc-900 rounded-lg p-3">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="font-semibold text-sm text-gray-100">{comment.author}</p>
                                            <p className="text-xs text-gray-500">{comment.time}</p>
                                        </div>
                                        <p className="text-sm text-gray-300">{comment.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    <div className="flex gap-3">
                        <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-full shrink-0" />
                        <div className="flex-1 flex gap-2">
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment()}
                                placeholder="Escreva um comentário..."
                                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                            />
                            <button
                                onClick={handleSubmitComment}
                                disabled={!newComment.trim()}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-800 disabled:text-gray-500 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Enviar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const MemberListItem: React.FC<{ user: User }> = ({ user }) => (
    <div className="flex items-center space-x-3">
      <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full" />
      <div className="flex-grow">
        <p className="font-medium text-sm text-gray-200">{user.name}</p>
        <div className="flex items-center space-x-1.5">
          <span className={`w-2 h-2 rounded-full ${user.online ? 'bg-green-500' : 'bg-gray-500'}`}></span>
          <p className={`text-xs ${user.online ? 'text-green-400' : 'text-gray-400'}`}>{user.online ? 'Online' : 'Offline'}</p>
        </div>
      </div>
    </div>
);

const mockPosts: Post[] = [
    {
        id: 1,
        author: 'R4 Academy',
        avatar: 'https://i.pravatar.cc/150?u=admin',
        time: 'há 2 horas',
        content: 'Bem-vindo à comunidade R4 Academy! 🎉\n\nAqui você pode compartilhar suas criações, tirar dúvidas e conectar-se com outros membros.',
        likes: 24,
        liked: false,
        pinned: true,
        comments: [
            {
                id: 1,
                author: 'Maria Silva',
                avatar: 'https://i.pravatar.cc/150?u=maria',
                content: 'Muito obrigada! Estou animada para fazer parte dessa comunidade!',
                time: 'há 1 hora'
            }
        ]
    },
    {
        id: 2,
        author: 'Maria Silva',
        avatar: 'https://i.pravatar.cc/150?u=maria',
        time: 'há 5 horas',
        content: 'Acabei de criar um vídeo incrível usando o gerador de vídeo! Os resultados ficaram muito melhores do que eu esperava.',
        likes: 15,
        liked: false,
        pinned: false,
        comments: []
    },
    {
        id: 3,
        author: 'João Santos',
        avatar: 'https://i.pravatar.cc/150?u=joao',
        time: 'há 1 dia',
        content: 'Dica: Para melhores resultados com o gerador de imagens, sejam bem específicos nos prompts. Quanto mais detalhes, melhor! 💡',
        likes: 31,
        liked: true,
        pinned: false,
        comments: []
    }
];

const mockAdmins: User[] = [
    {
        name: 'R4 Academy',
        email: 'admin@r4academy.com',
        avatar: 'https://i.pravatar.cc/150?u=admin',
        role: 'admin',
        online: true
    },
    {
        name: 'Suporte R4',
        email: 'suporte@r4academy.com',
        avatar: 'https://i.pravatar.cc/150?u=suporte',
        role: 'admin',
        online: false
    }
];

const CommunityView: React.FC = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState<Post[]>(mockPosts);
    
    const handleLikeToggle = (postId: number) => {
        setPosts(posts.map(post => 
            post.id === postId 
                ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
                : post
        ));
    };
    
    const handlePinToggle = (postId: number) => {
        if (user?.role !== 'admin') return;
        setPosts(posts.map(post => 
            post.id === postId 
                ? { ...post, pinned: !post.pinned }
                : post
        ));
    };
    
    const handleAddComment = (postId: number, content: string) => {
        const currentUser: User = {
            name: user?.name || 'Usuário',
            email: user?.email || 'user@email.com',
            avatar: 'https://i.pravatar.cc/150?u=' + user?.email,
            role: (user?.role as 'admin' | 'user') || 'user',
            online: true
        };
        
        const newComment: Comment = {
            id: Date.now(),
            author: currentUser.name,
            avatar: currentUser.avatar,
            content: content,
            time: 'agora'
        };
        
        setPosts(posts.map(post => 
            post.id === postId 
                ? { ...post, comments: [...(post.comments || []), newComment] }
                : post
        ));
    };
    
    const currentUser: User = {
        name: user?.name || 'Usuário',
        email: user?.email || 'user@email.com',
        avatar: 'https://i.pravatar.cc/150?u=' + user?.email,
        role: (user?.role as 'admin' | 'user') || 'user',
        online: true
    };
    
    const admins = mockAdmins;

  return (
    <div className="animate-fade-in">
        <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold tracking-tight text-white">Comunidade</h2>
            <div className="flex items-center space-x-2">
                <a 
                    href="#"
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[#5865F2] rounded-lg hover:bg-[#4f5bda] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-[#5865F2] transition-colors"
                >
                    <DiscordIcon className="w-5 h-5 mr-2 -ml-1" />
                    Entrar no Discord
                </a>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2 space-y-6">
                {posts.map(post => (
                    <PostCard 
                        key={post.id}
                        post={post}
                        onLikeToggle={handleLikeToggle}
                        onPinToggle={handlePinToggle}
                        onAddComment={handleAddComment}
                        currentUser={currentUser}
                    />
                ))}
            </div>
            <aside className="lg:col-span-1">
                <div className="bg-black p-5 rounded-xl border border-zinc-800 space-y-4 sticky top-8">
                    <h3 className="font-bold text-lg text-white">Admistradores Ativos</h3>
                    <div className="space-y-4">
                        {admins.filter(admin => admin.online).map(admin => (
                            <MemberListItem key={admin.email} user={admin} />
                        ))}
                    </div>
                    <div className="pt-4 border-t border-zinc-800 space-y-4">
                        {admins.filter(admin => !admin.online).map(admin => (
                            <MemberListItem key={admin.email} user={admin} />
                        ))}
                    </div>
                </div>
            </aside>
        </div>
    </div>
  );
};

export default CommunityView;