import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2.39.3';
import * as kv from './kv_store.tsx';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Prefixos para organização do KV
const PREFIXES = {
  USERS: 'user:',
  ESTABLISHMENTS: 'establishment:',
  ROUTES: 'route:',
  EMPLOYEES: 'employee:',
  ROUNDS: 'round:',
  CHECKPOINTS: 'checkpoint:',
  OCCURRENCES: 'occurrence:',
  CHAT_MESSAGES: 'chat:',
  REPORTS: 'report:',
  EMERGENCY: 'emergency:',
  OFFLINE_QUEUE: 'offline:'
};

// ==================== AUTH ====================

app.post('/make-server-76b0b579/signup', async (c) => {
  try {
    const { email, password, name, role, cpf } = await c.req.json();
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role, cpf },
      email_confirm: true // Auto-confirm since email server isn't configured
    });

    if (error) {
      console.log('Error during user signup:', error);
      return c.json({ error: error.message }, 400);
    }

    // Salvar dados adicionais do usuário
    await kv.set(`${PREFIXES.USERS}${data.user.id}`, {
      id: data.user.id,
      email,
      name,
      role, // 'admin', 'supervisor', 'guard'
      cpf,
      active: true,
      createdAt: new Date().toISOString()
    });

    return c.json({ user: data.user });
  } catch (error) {
    console.log('Signup error:', error);
    return c.json({ error: 'Internal server error during signup' }, 500);
  }
});

// ==================== ESTABLISHMENTS ====================

app.post('/make-server-76b0b579/establishments', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const establishmentData = await c.req.json();
    const id = crypto.randomUUID();
    
    const establishment = {
      id,
      ...establishmentData,
      createdAt: new Date().toISOString(),
      createdBy: user.id
    };

    await kv.set(`${PREFIXES.ESTABLISHMENTS}${id}`, establishment);
    return c.json({ establishment });
  } catch (error) {
    console.log('Error creating establishment:', error);
    return c.json({ error: 'Failed to create establishment' }, 500);
  }
});

app.get('/make-server-76b0b579/establishments', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const establishments = await kv.getByPrefix(PREFIXES.ESTABLISHMENTS);
    return c.json({ establishments });
  } catch (error) {
    console.log('Error fetching establishments:', error);
    return c.json({ error: 'Failed to fetch establishments' }, 500);
  }
});

app.put('/make-server-76b0b579/establishments/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const id = c.req.param('id');
    const updates = await c.req.json();
    
    const existing = await kv.get(`${PREFIXES.ESTABLISHMENTS}${id}`);
    if (!existing) {
      return c.json({ error: 'Establishment not found' }, 404);
    }

    const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
    await kv.set(`${PREFIXES.ESTABLISHMENTS}${id}`, updated);
    
    return c.json({ establishment: updated });
  } catch (error) {
    console.log('Error updating establishment:', error);
    return c.json({ error: 'Failed to update establishment' }, 500);
  }
});

// ==================== ROUTES ====================

app.post('/make-server-76b0b579/routes', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const routeData = await c.req.json();
    const id = crypto.randomUUID();
    
    const route = {
      id,
      ...routeData,
      createdAt: new Date().toISOString(),
      createdBy: user.id
    };

    await kv.set(`${PREFIXES.ROUTES}${id}`, route);
    return c.json({ route });
  } catch (error) {
    console.log('Error creating route:', error);
    return c.json({ error: 'Failed to create route' }, 500);
  }
});

app.get('/make-server-76b0b579/routes', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const routes = await kv.getByPrefix(PREFIXES.ROUTES);
    return c.json({ routes });
  } catch (error) {
    console.log('Error fetching routes:', error);
    return c.json({ error: 'Failed to fetch routes' }, 500);
  }
});

// ==================== EMPLOYEES ====================

app.get('/make-server-76b0b579/employees', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const employees = await kv.getByPrefix(PREFIXES.USERS);
    return c.json({ employees });
  } catch (error) {
    console.log('Error fetching employees:', error);
    return c.json({ error: 'Failed to fetch employees' }, 500);
  }
});

// ==================== ROUNDS ====================

app.post('/make-server-76b0b579/rounds', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const roundData = await c.req.json();
    const id = crypto.randomUUID();
    
    const round = {
      id,
      ...roundData,
      userId: user.id,
      createdAt: new Date().toISOString(),
      status: 'in_progress'
    };

    await kv.set(`${PREFIXES.ROUNDS}${id}`, round);
    return c.json({ round });
  } catch (error) {
    console.log('Error creating round:', error);
    return c.json({ error: 'Failed to create round' }, 500);
  }
});

app.get('/make-server-76b0b579/rounds', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const rounds = await kv.getByPrefix(PREFIXES.ROUNDS);
    
    // Filtrar por usuário se não for admin
    const userData = await kv.get(`${PREFIXES.USERS}${user.id}`);
    if (userData?.role !== 'admin') {
      const filteredRounds = rounds.filter(r => r.userId === user.id);
      return c.json({ rounds: filteredRounds });
    }
    
    return c.json({ rounds });
  } catch (error) {
    console.log('Error fetching rounds:', error);
    return c.json({ error: 'Failed to fetch rounds' }, 500);
  }
});

app.put('/make-server-76b0b579/rounds/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const id = c.req.param('id');
    const updates = await c.req.json();
    
    const existing = await kv.get(`${PREFIXES.ROUNDS}${id}`);
    if (!existing) {
      return c.json({ error: 'Round not found' }, 404);
    }

    const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
    await kv.set(`${PREFIXES.ROUNDS}${id}`, updated);
    
    return c.json({ round: updated });
  } catch (error) {
    console.log('Error updating round:', error);
    return c.json({ error: 'Failed to update round' }, 500);
  }
});

app.post('/make-server-76b0b579/rounds/:id/finish', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const id = c.req.param('id');
    
    const existing = await kv.get(`${PREFIXES.ROUNDS}${id}`);
    if (!existing) {
      return c.json({ error: 'Round not found' }, 404);
    }

    const finished = { 
      ...existing, 
      status: 'completed',
      finishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await kv.set(`${PREFIXES.ROUNDS}${id}`, finished);
    
    return c.json({ round: finished, message: 'Round finished successfully' });
  } catch (error) {
    console.log('Error finishing round:', error);
    return c.json({ error: 'Failed to finish round' }, 500);
  }
});

// ==================== CHECKPOINTS ====================

app.post('/make-server-76b0b579/checkpoints', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const checkpointData = await c.req.json();
    const id = crypto.randomUUID();
    
    const checkpoint = {
      id,
      ...checkpointData,
      userId: user.id,
      createdAt: new Date().toISOString()
    };

    await kv.set(`${PREFIXES.CHECKPOINTS}${id}`, checkpoint);
    return c.json({ checkpoint });
  } catch (error) {
    console.log('Error creating checkpoint:', error);
    return c.json({ error: 'Failed to create checkpoint' }, 500);
  }
});

app.get('/make-server-76b0b579/checkpoints/:roundId', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const roundId = c.req.param('roundId');
    const allCheckpoints = await kv.getByPrefix(PREFIXES.CHECKPOINTS);
    const checkpoints = allCheckpoints.filter(cp => cp.roundId === roundId);
    
    return c.json({ checkpoints });
  } catch (error) {
    console.log('Error fetching checkpoints:', error);
    return c.json({ error: 'Failed to fetch checkpoints' }, 500);
  }
});

// ==================== OCCURRENCES ====================

app.post('/make-server-76b0b579/occurrences', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const occurrenceData = await c.req.json();
    const id = crypto.randomUUID();
    
    const occurrence = {
      id,
      ...occurrenceData,
      userId: user.id,
      createdAt: new Date().toISOString(),
      status: 'open'
    };

    await kv.set(`${PREFIXES.OCCURRENCES}${id}`, occurrence);
    
    // Se for emergência, criar registro especial
    if (occurrenceData.isEmergency) {
      await kv.set(`${PREFIXES.EMERGENCY}${id}`, {
        ...occurrence,
        acknowledgedAt: null
      });
    }
    
    return c.json({ occurrence });
  } catch (error) {
    console.log('Error creating occurrence:', error);
    return c.json({ error: 'Failed to create occurrence' }, 500);
  }
});

app.get('/make-server-76b0b579/occurrences', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const occurrences = await kv.getByPrefix(PREFIXES.OCCURRENCES);
    return c.json({ occurrences });
  } catch (error) {
    console.log('Error fetching occurrences:', error);
    return c.json({ error: 'Failed to fetch occurrences' }, 500);
  }
});

app.get('/make-server-76b0b579/emergencies', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const emergencies = await kv.getByPrefix(PREFIXES.EMERGENCY);
    return c.json({ emergencies });
  } catch (error) {
    console.log('Error fetching emergencies:', error);
    return c.json({ error: 'Failed to fetch emergencies' }, 500);
  }
});

// ==================== CHAT ====================

app.post('/make-server-76b0b579/chat/messages', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const messageData = await c.req.json();
    const id = crypto.randomUUID();
    const timestamp = new Date().toISOString();
    
    const message = {
      id,
      ...messageData,
      userId: user.id,
      createdAt: timestamp
    };

    await kv.set(`${PREFIXES.CHAT_MESSAGES}${timestamp}:${id}`, message);
    return c.json({ message });
  } catch (error) {
    console.log('Error sending message:', error);
    return c.json({ error: 'Failed to send message' }, 500);
  }
});

app.get('/make-server-76b0b579/chat/messages', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const channelId = c.req.query('channelId');
    const allMessages = await kv.getByPrefix(PREFIXES.CHAT_MESSAGES);
    
    let messages = allMessages;
    if (channelId) {
      messages = allMessages.filter(m => m.channelId === channelId);
    }
    
    // Ordenar por data
    messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    
    return c.json({ messages });
  } catch (error) {
    console.log('Error fetching messages:', error);
    return c.json({ error: 'Failed to fetch messages' }, 500);
  }
});

// ==================== REPORTS ====================

app.get('/make-server-76b0b579/reports/rounds', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const startDate = c.req.query('startDate');
    const endDate = c.req.query('endDate');
    const type = c.req.query('type');
    const establishmentId = c.req.query('establishmentId');

    const rounds = await kv.getByPrefix(PREFIXES.ROUNDS);
    let filtered = rounds;

    if (startDate) {
      filtered = filtered.filter(r => new Date(r.createdAt) >= new Date(startDate));
    }
    if (endDate) {
      filtered = filtered.filter(r => new Date(r.createdAt) <= new Date(endDate));
    }
    if (type) {
      filtered = filtered.filter(r => r.type === type);
    }
    if (establishmentId) {
      filtered = filtered.filter(r => r.establishmentId === establishmentId);
    }

    // Buscar checkpoints para cada ronda
    const allCheckpoints = await kv.getByPrefix(PREFIXES.CHECKPOINTS);
    const roundsWithCheckpoints = filtered.map(round => ({
      ...round,
      checkpoints: allCheckpoints.filter(cp => cp.roundId === round.id)
    }));

    return c.json({ rounds: roundsWithCheckpoints });
  } catch (error) {
    console.log('Error generating report:', error);
    return c.json({ error: 'Failed to generate report' }, 500);
  }
});

// ==================== OFFLINE SYNC ====================

app.post('/make-server-76b0b579/sync', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { actions } = await c.req.json();
    const results = [];

    for (const action of actions) {
      try {
        const { type, data, entityType } = action;
        
        if (type === 'create') {
          const id = data.id || crypto.randomUUID();
          const prefix = PREFIXES[entityType.toUpperCase()] || PREFIXES.OFFLINE_QUEUE;
          await kv.set(`${prefix}${id}`, { ...data, id, userId: user.id });
          results.push({ success: true, id });
        } else if (type === 'update') {
          const prefix = PREFIXES[entityType.toUpperCase()];
          const existing = await kv.get(`${prefix}${data.id}`);
          if (existing) {
            await kv.set(`${prefix}${data.id}`, { ...existing, ...data });
            results.push({ success: true, id: data.id });
          } else {
            results.push({ success: false, error: 'Not found' });
          }
        }
      } catch (error) {
        console.log('Sync action error:', error);
        results.push({ success: false, error: error.message });
      }
    }

    return c.json({ results });
  } catch (error) {
    console.log('Sync error:', error);
    return c.json({ error: 'Failed to sync data' }, 500);
  }
});

Deno.serve(app.fetch);