import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chatId = searchParams.get('chatId');
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    return NextResponse.json({ error: 'Token not configured' }, { status: 500 });
  }

  if (!chatId) {
    return NextResponse.json({ error: 'Chat ID required' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/getChatMemberCount?chat_id=${chatId}`,
      { next: { revalidate: 1 } }
    );
    
    if (!response.ok) {
      throw new Error('Telegram API Error');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ result: 0 }, { status: 500 });
  }
}
