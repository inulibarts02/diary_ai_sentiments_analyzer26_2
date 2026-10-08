import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import { NextResponse } from 'next/server';

const sentimentSchema = z.object({
  selectedMood: z.enum(['joy', 'calm', 'sadness', 'anger', 'tired']).describe('5가지 대표 감정 중 일기에 가장 부합하는 1가지 (joy: 기쁨, calm: 평온, sadness: 슬픔, anger: 분노, tired: 피로/불안)'),
  moodLabel: z.string().describe('대표 감정 한글 라벨 (예: 평온, 기쁨 등)'),
  moodConfidence: z.number().int().min(0).max(100).describe('대표 감정 신뢰도 퍼센트 (예: 68)'),
  sentimentScore: z.number().int().min(0).max(100).describe('전반적인 감정 지수 (0~100점)'),
  sentimentStatus: z.string().describe('감정 상태 한마디 (예: 안정, 활력, 회복 필요 등)'),
  primaryMoodHeadline: z.string().describe('PRIMARY MOOD SPECTRUM 헤드라인 문구 (예: "전체적으로 안도감과 성취감이 어우러진 \'차분한 만족감(Calm Contentment)\' 상태입니다.")'),
  primaryMoodDescription: z.string().describe('헤드라인에 대한 한 문장 요약 설명'),
  scoreBreakdown: z.array(z.object({
    name: z.string().describe('감정 요소명 (예: 긍정·안도감, 피로감, 잔여 긴장감 등)'),
    percentage: z.number().int().min(0).max(100).describe('비율 (퍼센트)')
  })).describe('감정 점수 분포 요소 3가지'),
  keywords: z.array(z.string()).describe('일기에서 추출한 핵심 감정/상황 해시태그 4~5개 (예: #프로젝트첫발표, #팀원호흡 등)'),
  keywordsNote: z.string().describe('키워드에 대한 간략한 해설 한 문장'),
  healingPrescriptions: z.array(z.object({
    icon: z.enum(['music', 'bath', 'walk', 'tea', 'book', 'rest']).describe('처방 아이콘 유형'),
    title: z.string().describe('처방 내용 (예: 잔잔한 빗소리 로파이 재즈 추천, 따뜻한 물로 발 목욕 10분 하기)')
  })).describe('맞춤 힐링 처방 2가지'),
  prescriptionsNote: z.string().describe('처방에 대한 공감 설명 한 문장'),
  empatheticLetter: z.string().describe('Gemini의 따뜻한 공감 한마디 (2~3문장 정도의 진정성 있고 다정한 위로/응원 메시지)')
});

export async function POST(req: Request) {
  try {
    const { diaryText } = await req.json();

    if (!diaryText || typeof diaryText !== 'string' || !diaryText.trim()) {
      return NextResponse.json(
        { error: '일기 내용을 입력해주세요.' },
        { status: 400 }
      );
    }

    const { object } = await generateObject({
      model: google('gemini-3.1-flash-lite'),
      schema: sentimentSchema,
      prompt: `다음은 사용자가 작성한 오늘의 일기입니다.
전문적이고 따뜻한 심리 상담가 및 감성 코칭 전문가의 시선으로 감성을 정밀 분석해주세요.

--- 일기 내용 ---
${diaryText}
------------------

요구사항:
1. 5대 핵심 감정 ('joy' 기쁨, 'calm' 평온, 'sadness' 슬픔, 'anger' 분노, 'tired' 피로/불안) 중 가장 두드러진 감정 하나를 선택하세요.
2. 따뜻하고 위로가 되며 세심한 분석 결과를 한국어로 작성해주세요.
3. 감정 점수 분포와 키워드, 힐링 처방, 따뜻한 공감의 한마디를 충실히 작성해주세요.`
    });

    return NextResponse.json(object);
  } catch (error: any) {
    console.error('Sentiment Analysis Error:', error);
    return NextResponse.json(
      { error: error?.message || '감성 분석 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
