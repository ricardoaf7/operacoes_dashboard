const { createClient } = require('@supabase/supabase-js');

// Configurações do Supabase
const supabaseUrl = 'https://ixqhqhqvqhqhqhqvqhqh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4cWhxaHF2cWhxaHFocXZxaHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0NjI5NzQsImV4cCI6MjA1MDAzODk3NH0.example_signature';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTableStructure() {
  try {
    const { data, error } = await supabase
      .from('areas')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Erro ao acessar tabela:', error);
    } else {
      console.log('Estrutura da tabela areas:', data);
    }
  } catch (err) {
    console.error('Erro geral:', err);
  }
}

checkTableStructure();