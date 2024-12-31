import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://knjpwwuewkowihstqirm.supabase.co'
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuanB3d3Vld2tvd2loc3RxaXJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2NzgwNTEsImV4cCI6MjA1MTI1NDA1MX0.674ulWMWToVZJ8ZwxCvigBpigyxQ7NdNldMNqKO3O_Y'
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export default ({ app }) => {
  // This makes the supabase client available in all components
  app.config.globalProperties.$supabase = supabase
}

export { supabase }
