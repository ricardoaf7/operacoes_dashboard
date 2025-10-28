import React, { useState } from 'react';

const TestAppSimple: React.FC = () => {
    const [step, setStep] = useState(1);
    const [error, setError] = useState<string | null>(null);

    const testStep = async (stepNumber: number) => {
        try {
            setError(null);
            setStep(stepNumber);
            
            if (stepNumber === 2) {
                // Testar importação do useAppData
                const { default: useAppData } = await import('./hooks/useAppData');
                console.log('useAppData importado com sucesso');
            } else if (stepNumber === 3) {
                // Testar importação dos componentes
                const { default: Sidebar } = await import('./components/Sidebar');
                const { default: MapComponent } = await import('./components/MapComponent');
                console.log('Componentes importados com sucesso');
            } else if (stepNumber === 4) {
                // Testar App completo
                const { default: App } = await import('./App');
                console.log('App importado com sucesso');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
            console.error('Erro no passo', stepNumber, ':', err);
        }
    };

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen bg-red-900 text-white">
                <div className="text-center p-8">
                    <h1 className="text-2xl font-bold mb-4">❌ Erro Encontrado!</h1>
                    <p className="mb-4">Passo {step}: {error}</p>
                    <pre className="bg-red-800 p-4 rounded text-sm text-left overflow-auto max-w-2xl">
                        {error}
                    </pre>
                    <button 
                        onClick={() => {
                            setError(null);
                            setStep(1);
                        }}
                        className="mt-4 bg-red-700 hover:bg-red-600 px-4 py-2 rounded"
                    >
                        🔄 Reiniciar Teste
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
            <div className="text-center p-8">
                <h1 className="text-3xl font-bold mb-6">🔍 Diagnóstico do Dashboard</h1>
                
                <div className="space-y-4 mb-8">
                    <div className={`p-4 rounded ${step >= 1 ? 'bg-green-600' : 'bg-gray-600'}`}>
                        ✅ Passo 1: React e Vite funcionando
                    </div>
                    
                    <div className={`p-4 rounded ${step >= 2 ? (error ? 'bg-red-600' : 'bg-green-600') : 'bg-gray-600'}`}>
                        {step >= 2 ? '✅' : '⏳'} Passo 2: Testar useAppData hook
                    </div>
                    
                    <div className={`p-4 rounded ${step >= 3 ? (error ? 'bg-red-600' : 'bg-green-600') : 'bg-gray-600'}`}>
                        {step >= 3 ? '✅' : '⏳'} Passo 3: Testar componentes (Sidebar, MapComponent)
                    </div>
                    
                    <div className={`p-4 rounded ${step >= 4 ? (error ? 'bg-red-600' : 'bg-green-600') : 'bg-gray-600'}`}>
                        {step >= 4 ? '✅' : '⏳'} Passo 4: Testar App completo
                    </div>
                </div>

                <div className="space-x-4">
                    {step < 4 && (
                        <button 
                            onClick={() => testStep(step + 1)}
                            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded"
                        >
                            Próximo Passo
                        </button>
                    )}
                    
                    {step === 4 && !error && (
                        <div className="text-center">
                            <p className="text-green-400 mb-4">🎉 Todos os testes passaram!</p>
                            <button 
                                onClick={() => {
                                    // Carregar o App real
                                    window.location.reload();
                                }}
                                className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded"
                            >
                                Carregar Dashboard
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TestAppSimple;