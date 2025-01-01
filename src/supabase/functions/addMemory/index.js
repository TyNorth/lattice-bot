// supabase/functions/addMemory/index.js

const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(process.env.SUPABASE_URL, process.envSUPABASE_KEY)

exports.handler = async (event) => {
  const { conversationId, content, embedding } = JSON.parse(event.body)

  const { data, error } = await supabase
    .from('memory')
    .insert([{ conversation_id: conversationId, content, embedding }])

  if (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  }
}
