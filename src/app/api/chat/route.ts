import { NextResponse } from "next/server";

import { openai } from "@/lib/openai/client";
import { chatRequestSchema } from "@/server/validation/chat";
