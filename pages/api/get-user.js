import { supabase } from "../supabaseClient"

export default function getUser(req, res) {


    return res.status(200).json({ name: 'John Doe' })
  }