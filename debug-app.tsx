import React, { useState } from 'react';
import { db as initialDb, APP_CONFIG as initialAppConfig } from './data';

const DebugApp: React.FC = () => {
    console.log('DebugApp rendering...');
    console.log('Initial data:', { db: initialDb, config: initialAppConfig });

    const [testStep, setTestStep] = useState(1);

    const renderStep = () => {
        switch (testStep) {
            case 1:
                return (
                    <div>
                        <h2>✅ Passo 1: Componente Básico</h2>
                        <p>React está funcionando!</p>
                        <button onClick={() => setTestStep(2)}>Próximo: Testar Dados</button>
                    </div>
                );
            
            case 2:
                return (
                    <div>
                        <h2>✅ Passo 2: Dados Iniciais</h2>
                        <p><strong>Serviços:</strong> {initialDb.services.length}</p>
                        <p><strong>Equipes:</strong> {initialDb.teams.length}</p>
                        <p><strong>Taxa Roçagem Lote 1:</strong> {initialAppConfig.mowingProductionRate.lote1} m²/dia</p>
                        <button onClick={() => setTestStep(3)}>Próximo: Testar useAppData</button>
                    </div>
                );
            
            case 3:
                return <TestUseAppData />;
            
            default:
                return <div>Teste concluído!</div>;
        }
    };

    return (
        <div style={{ 
            padding: '20px', 
            backgroundColor: '#1f2937', 
            color: 'white', 
            minHeight: '100vh',
            fontFamily: 'Arial, sans-serif'
        }}>
            <h1>🔍 Debug do Dashboard - Passo a Passo</h1>
            
            <div style={{ 
                margin: '20px 0', 
                padding: '15px', 
                border: '1px solid #3b82f6', 
                borderRadius: '8px' 
            }}>
                {renderStep()}
            </div>

            <div style={{ 
                margin: '20px 0', 
                padding: '15px', 
                border: '1px solid #6b7280', 
                borderRadius: '8px',
                fontSize: '12px'
            }}>
                <h3>Console Log</h3>
                <p>Verifique o console do navegador (F12) para mais detalhes.</p>
            </div>
        </div>
    );
};

const TestUseAppData: React.FC = () => {
    console.log('TestUseAppData rendering...');
    
    try {
        // Importar dinamicamente o hook
        const useAppData = require('./hooks/useAppData').default;
        const { db, appConfig } = useAppData();
        
        console.log('useAppData result:', { db, appConfig });

        if (!db || !appConfig) {
            return (
                <div>
                    <h2>⏳ Passo 3: Carregando useAppData...</h2>
                    <p>db: {db ? '✅' : '❌'}</p>
                    <p>appConfig: {appConfig ? '✅' : '❌'}</p>
                </div>
            );
        }

        return (
            <div>
                <h2>✅ Passo 3: useAppData Funcionando!</h2>
                <p><strong>Serviços carregados:</strong> {db.services.length}</p>
                <p><strong>Equipes carregadas:</strong> {db.teams.length}</p>
                <p>O hook useAppData está funcionando corretamente!</p>
                <div style={{ marginTop: '20px' }}>
                    <h3>🎯 Problema Identificado</h3>
                    <p>Se chegou até aqui, o problema pode estar em:</p>
                    <ul>
                        <li>Componentes Sidebar, MapComponent, etc.</li>
                        <li>Dependências externas (Leaflet, etc.)</li>
                        <li>Importações de CSS ou outros recursos</li>
                    </ul>
                </div>
            </div>
        );
    } catch (error) {
        console.error('Erro no useAppData:', error);
        return (
            <div>
                <h2>❌ Passo 3: Erro no useAppData</h2>
                <p><strong>Erro:</strong> {error instanceof Error ? error.message : String(error)}</p>
                <pre style={{ 
                    backgroundColor: '#374151', 
                    padding: '10px', 
                    borderRadius: '4px',
                    fontSize: '12px',
                    overflow: 'auto'
                }}>
                    {error instanceof Error ? error.stack : String(error)}
                </pre>
            </div>
        );
    }
};

export default DebugApp;