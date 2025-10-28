import React from 'react';

const SimpleTest: React.FC = () => {
    console.log('SimpleTest component rendering...');
    
    // Teste das variáveis de ambiente
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    console.log('Environment variables:', {
        url: supabaseUrl,
        key: supabaseKey ? 'Present' : 'Missing'
    });

    return (
        <div style={{ 
            padding: '20px', 
            backgroundColor: '#1f2937', 
            color: 'white', 
            minHeight: '100vh',
            fontFamily: 'Arial, sans-serif'
        }}>
            <h1>🧪 Teste Simples do Dashboard</h1>
            
            <div style={{ 
                margin: '20px 0', 
                padding: '15px', 
                border: '1px solid #10b981', 
                borderRadius: '8px' 
            }}>
                <h2>✅ React Funcionando</h2>
                <p>Este componente React está renderizando corretamente!</p>
            </div>

            <div style={{ 
                margin: '20px 0', 
                padding: '15px', 
                border: `1px solid ${supabaseUrl ? '#10b981' : '#ef4444'}`, 
                borderRadius: '8px' 
            }}>
                <h2>{supabaseUrl ? '✅' : '❌'} Variáveis de Ambiente</h2>
                <p><strong>VITE_SUPABASE_URL:</strong> {supabaseUrl || 'Não encontrada'}</p>
                <p><strong>VITE_SUPABASE_ANON_KEY:</strong> {supabaseKey ? 'Configurada' : 'Não encontrada'}</p>
            </div>

            <div style={{ 
                margin: '20px 0', 
                padding: '15px', 
                border: '1px solid #3b82f6', 
                borderRadius: '8px' 
            }}>
                <h2>🔧 Próximos Passos</h2>
                <p>Se você está vendo esta página, o React está funcionando.</p>
                <p>O problema pode estar no hook useAppData ou na conexão com Supabase.</p>
            </div>
        </div>
    );
};

export default SimpleTest;