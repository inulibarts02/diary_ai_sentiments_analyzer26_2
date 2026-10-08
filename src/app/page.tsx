'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  RotateCcw,
  Smile,
  Leaf,
  CloudRain,
  Flame,
  BatteryLow,
  CheckCircle2,
  Clock,
  Mic,
  Hash,
  Coffee,
  Bath,
  Music,
  Footprints,
  BookOpen,
  BedDouble,
  Quote,
  Loader2,
  ShieldCheck,
  Save,
  Book,
  Trash2,
  Edit3,
  X,
  RefreshCw,
  Check,
  Heart
} from 'lucide-react';

interface AnalysisResult {
  selectedMood: 'joy' | 'calm' | 'sadness' | 'anger' | 'tired';
  moodLabel: string;
  moodConfidence: number;
  sentimentScore: number;
  sentimentStatus: string;
  primaryMoodHeadline: string;
  primaryMoodDescription: string;
  scoreBreakdown: { name: string; percentage: number }[];
  keywords: string[];
  keywordsNote: string;
  healingPrescriptions: { icon: 'music' | 'bath' | 'walk' | 'tea' | 'book' | 'rest'; title: string }[];
  prescriptionsNote: string;
  empatheticLetter: string;
}

const MOODS = [
  {
    id: 'joy',
    label: '기쁨',
    sub: '성취 · 뿌듯함',
    icon: Smile,
    color: '#FFB703',
    bgColor: 'bg-amber-50',
    selectedBorder: 'border-amber-400',
    selectedBg: 'bg-amber-100/70',
    badgeBg: 'bg-amber-500 text-white',
    badgeText: '추천'
  },
  {
    id: 'calm',
    label: '평온',
    sub: '안도 · 차분함',
    icon: Leaf,
    color: '#52B788',
    bgColor: 'bg-emerald-50',
    selectedBorder: 'border-emerald-500',
    selectedBg: 'bg-emerald-100/70',
    badgeBg: 'bg-emerald-600 text-white',
    badgeText: '추천'
  },
  {
    id: 'sadness',
    label: '슬픔',
    sub: '외로움 · 울적',
    icon: CloudRain,
    color: '#4EA8DE',
    bgColor: 'bg-sky-50',
    selectedBorder: 'border-sky-400',
    selectedBg: 'bg-sky-100/70',
    badgeBg: 'bg-sky-500 text-white',
    badgeText: '추천'
  },
  {
    id: 'anger',
    label: '분노',
    sub: '답답함 · 짜증',
    icon: Flame,
    color: '#E63946',
    bgColor: 'bg-rose-50',
    selectedBorder: 'border-rose-400',
    selectedBg: 'bg-rose-100/70',
    badgeBg: 'bg-rose-500 text-white',
    badgeText: '추천'
  },
  {
    id: 'tired',
    label: '피로/불안',
    sub: '지침 · 긴장',
    icon: BatteryLow,
    color: '#A06CD5',
    bgColor: 'bg-purple-50',
    selectedBorder: 'border-purple-400',
    selectedBg: 'bg-purple-100/70',
    badgeBg: 'bg-purple-600 text-white',
    badgeText: '추천'
  },
] as const;

interface DiaryEntry {
  rowIndex?: number;
  timestamp: string;
  datetime: string;
  content: string;
}

export default function Home() {
  const [diaryText, setDiaryText] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [currentDateFormatted, setCurrentDateFormatted] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  // 구글 시트 CRUD 관련 상태
  const [diaryList, setDiaryList] = useState<DiaryEntry[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isListOpen, setIsListOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [deletingTimestamp, setDeletingTimestamp] = useState<string | null>(null);

  const googleScriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || '';

  // 1. 구글 시트 일기 목록 조회 (Read)
  const fetchDiaryList = async () => {
    if (!googleScriptUrl) {
      alert('구글 앱스 스크립트 URL이 설정되지 않았습니다.');
      return;
    }
    setIsLoadingList(true);
    try {
      const response = await fetch(`${googleScriptUrl}?action=read`);
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        // 최신순으로 정렬 (timestamp 기준 내림차순)
        const sorted = [...result.data].sort((a, b) => Number(b.timestamp) - Number(a.timestamp));
        setDiaryList(sorted);
      } else {
        alert('일기 목록을 불러오지 못했습니다: ' + (result.message || '알 수 없는 오류'));
      }
    } catch (err: any) {
      alert('일기 목록 조회 실패: ' + (err.message || '네트워크 오류'));
    } finally {
      setIsLoadingList(false);
    }
  };

  // [일기보기] 버튼 클릭 핸들러
  const handleOpenDiaryList = () => {
    setIsListOpen(true);
    fetchDiaryList();
  };

  // 2. 구글 시트에 일기 저장 (Create)
  const handleSaveDiary = async () => {
    if (!diaryText.trim()) {
      alert('저장할 일기 내용을 입력해주세요.');
      return;
    }
    if (!googleScriptUrl) {
      alert('구글 앱스 스크립트 URL이 설정되지 않았습니다 (.env.local 확인).');
      return;
    }

    setIsSaving(true);
    try {
      const now = new Date();
      const timestamp = String(now.getTime());
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const date = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const datetime = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;

      const payload = {
        action: 'create',
        timestamp,
        datetime,
        content: diaryText.trim()
      };

      const response = await fetch(googleScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });

      const res = await response.json();
      if (res.success) {
        alert('구글 시트에 일기가 안전하게 저장되었습니다!');
      } else {
        alert('일기 저장 실패: ' + (res.message || '오류 발생'));
      }
    } catch (err: any) {
      alert('저장 중 네트워크 오류가 발생했습니다: ' + (err.message || ''));
    } finally {
      setIsSaving(false);
    }
  };

  // 3. 구글 시트 일기 수정 (Update)
  const handleUpdateDiary = async () => {
    if (!editingEntry || !editContent.trim()) {
      alert('수정할 내용을 입력해주세요.');
      return;
    }
    setIsUpdating(true);
    try {
      const payload = {
        action: 'update',
        timestamp: editingEntry.timestamp,
        content: editContent.trim()
      };

      const response = await fetch(googleScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
      const res = await response.json();
      if (res.success) {
        alert('일기가 수정되었습니다.');
        setEditingEntry(null);
        fetchDiaryList();
      } else {
        alert('수정 실패: ' + (res.message || '오류 발생'));
      }
    } catch (err: any) {
      alert('수정 중 오류가 발생했습니다: ' + (err.message || ''));
    } finally {
      setIsUpdating(false);
    }
  };

  // 4. 구글 시트 일기 삭제 (Delete)
  const handleDeleteDiary = async (timestamp: string) => {
    if (!window.confirm('정말 이 일기를 삭제하시겠습니까?')) {
      return;
    }
    setDeletingTimestamp(timestamp);
    try {
      const payload = {
        action: 'delete',
        timestamp
      };

      const response = await fetch(googleScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
      const res = await response.json();
      if (res.success) {
        alert('일기가 삭제되었습니다.');
        fetchDiaryList();
      } else {
        alert('삭제 실패: ' + (res.message || '오류 발생'));
      }
    } catch (err: any) {
      alert('삭제 중 오류가 발생했습니다: ' + (err.message || ''));
    } finally {
      setDeletingTimestamp(null);
    }
  };

  // 날짜, 요일, 시간 실시간 표시
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const date = now.getDate();
      const day = days[now.getDay()];

      const hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? '오후' : '오전';
      const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

      setCurrentDateFormatted(`${year}년 ${month}월 ${date}일 ${day}`);
      setCurrentTime(`${ampm} ${formattedHours}:${formattedMinutes}`);
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  // AI 분석 실행 (Gemini Flash 연동)
  const handleAnalyze = async () => {
    if (!diaryText.trim()) {
      alert('일기 내용을 입력해주세요.');
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ diaryText }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'AI 분석 요청에 실패했습니다.');
      }

      const data: AnalysisResult = await response.json();
      setAnalysisResult(data);
      if (data.selectedMood) {
        setSelectedMood(data.selectedMood);
      }
    } catch (err: any) {
      alert(`분석 실패: ${err.message || '네트워크 오류가 발생했습니다.'}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 재시작 (작성 초기화)
  const handleReset = () => {
    if (diaryText.trim() && !window.confirm('작성 중인 일기를 초기화하고 새로 작성하시겠습니까?')) {
      return;
    }
    setDiaryText('');
    setAnalysisResult(null);
    setSelectedMood('');
  };

  const renderPrescriptionIcon = (type: string) => {
    switch (type) {
      case 'music':
        return <Music className="w-4 h-4 text-purple-600" />;
      case 'bath':
        return <Bath className="w-4 h-4 text-emerald-600" />;
      case 'walk':
        return <Footprints className="w-4 h-4 text-sky-600" />;
      case 'tea':
        return <Coffee className="w-4 h-4 text-amber-600" />;
      case 'book':
        return <BookOpen className="w-4 h-4 text-indigo-600" />;
      case 'rest':
      default:
        return <BedDouble className="w-4 h-4 text-purple-600" />;
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF9FD] text-[#1D1A22] py-8 px-4 sm:px-6 flex flex-col items-center">
      <div className="w-full max-w-[680px] space-y-6">
        
        {/* 서비스 타이틀 & 헤더 */}
        <header className="flex flex-col items-center text-center pt-3 pb-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1D1A22] tracking-tight">
            AI 일기 감성 분석
          </h1>
        </header>

        {/* 날짜 표시 영역 */}
        <div className="flex items-center justify-center pt-1 pb-1">
          <div className="flex items-center gap-2 bg-[#F3EDF7] rounded-full px-4 py-2 shadow-xs text-sm font-semibold text-[#1D1A22]">
            <span className="text-[#6750A4]">📅</span>
            <span>{currentDateFormatted || '오늘'}</span>
          </div>
        </div>

        {/* 일기 작성 영역 */}
        <section className="bg-white rounded-3xl p-5 sm:p-6 shadow-[0px_1px_3px_1px_rgba(103,80,164,0.08),0px_1px_2px_0px_rgba(0,0,0,0.08)] border border-[#ECE6F0] space-y-4">
          <div className="flex items-center justify-between border-b border-[#F3EDF7] pb-2 text-xs text-[#79747E]">
            <div className="flex items-center gap-1.5 font-medium text-[#49454F]">
              <span className="w-2 h-2 rounded-full bg-[#6750A4] inline-block" />
              <span>오늘의 이야기</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 mr-1">
                <Clock className="w-3 h-3 text-[#6750A4]" />
                <span className="hidden xs:inline">{currentTime} 작성 중</span>
              </div>

              {/* 저장 버튼 */}
              <button
                type="button"
                onClick={handleSaveDiary}
                disabled={isSaving}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#6750A4] hover:bg-[#4F378A] text-white rounded-full font-medium transition-all shadow-xs active:scale-95 disabled:opacity-60 cursor-pointer"
                title="구글 시트에 일기 저장"
              >
                {isSaving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>{isSaving ? '저장 중...' : '저장'}</span>
              </button>

              {/* 일기보기 버튼 ([저장] 버튼 오른쪽) */}
              <button
                type="button"
                onClick={handleOpenDiaryList}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F3EDF7] hover:bg-[#EADDFF] text-[#6750A4] border border-[#E7E0EB] rounded-full font-medium transition-all shadow-xs active:scale-95 cursor-pointer"
                title="구글 시트 일기 목록 보기"
              >
                <Book className="w-3.5 h-3.5" />
                <span>일기보기</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <textarea
              value={diaryText}
              onChange={(e) => setDiaryText(e.target.value)}
              placeholder="오늘 하루는 어떠셨나요? 솔직한 생각과 일어난 일, 느꼈던 감정들을 자유롭게 적어보세요..."
              rows={6}
              className="w-full resize-none text-[15px] sm:text-base leading-relaxed text-[#1D1A22] placeholder-[#9E9A9F] outline-none bg-transparent"
              maxLength={1000}
            />
          </div>

          {/* 작성 카드 하단 툴바 및 글자수 카운터 */}
          <div className="flex items-center justify-between text-xs text-[#79747E] pt-2 border-t border-[#F3EDF7]">
            <div className="flex items-center gap-3">
              <button title="태그 추가" className="hover:text-[#6750A4] transition-colors p-1 rounded-full hover:bg-[#F3EDF7]">
                <Hash className="w-4 h-4" />
              </button>
              <button title="음성 입력" className="hover:text-[#6750A4] transition-colors p-1 rounded-full hover:bg-[#F3EDF7]">
                <Mic className="w-4 h-4" />
              </button>
            </div>
            <div className="font-medium">
              <span className="text-[#6750A4] font-semibold">{diaryText.length}</span> / 1,000자
            </div>
          </div>
        </section>

        {/* 액션 버튼 바 (AI 감성 분석 실행, 새로 작성(재시작)) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="flex items-center justify-center gap-2 bg-[#6750A4] hover:bg-[#4F378A] active:scale-[0.98] text-white font-semibold py-3.5 px-6 rounded-full shadow-sm transition-all disabled:opacity-60 text-sm"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Gemini가 감성을 분석하고 있습니다...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>AI 감성 분석 실행</span>
                <span className="bg-[#4F378A] text-[10px] px-1.5 py-0.5 rounded-full font-normal">
                  Gemini 3.1
                </span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-2 bg-[#F3EDF7] hover:bg-[#EADDFF] active:scale-[0.98] text-[#6750A4] font-semibold py-3.5 px-6 rounded-full transition-all text-sm border border-[#E7E0EB]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>새로 작성 (재시작)</span>
          </button>
        </div>

        {/* 감성 이모지 영역 (AI 분석 완료 시 화면에 노출) */}
        {analysisResult && (
          <section className="bg-white rounded-3xl p-5 shadow-[0px_1px_3px_1px_rgba(103,80,164,0.06)] border border-[#ECE6F0] space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Smile className="w-4 h-4 text-[#6750A4]" />
                <span className="font-bold text-sm text-[#1D1A22]">오늘의 대표 감성 선택</span>
                <span className="text-[11px] text-[#79747E] hidden sm:inline">(AI가 문맥을 분석하여 최적의 감정을 추천했습니다)</span>
              </div>
              <div className="flex items-center gap-1 bg-emerald-50 text-emerald-800 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                AI 감정 태그: {analysisResult.moodLabel} ({analysisResult.moodConfidence}%)
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2 pt-1">
              {MOODS.map((mood) => {
                const IconComp = mood.icon;
                const isSelected = selectedMood === mood.id;

                return (
                  <button
                    key={mood.id}
                    onClick={() => setSelectedMood(mood.id)}
                    className={`relative flex flex-col items-center justify-center py-3 px-1 rounded-2xl transition-all duration-200 ${
                      isSelected
                        ? `${mood.selectedBg} border-2 ${mood.selectedBorder} shadow-sm scale-102`
                        : 'bg-[#F9F6FA] hover:bg-[#F3EDF7] border border-transparent'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute -top-2 bg-[#6750A4] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full shadow-xs flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5" />
                        추천
                      </span>
                    )}
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center mb-1.5 transition-transform ${
                        isSelected ? 'scale-110' : ''
                      }`}
                      style={{ backgroundColor: `${mood.color}22` }}
                    >
                      <IconComp className="w-5 h-5" style={{ color: mood.color }} />
                    </div>
                    <span className={`text-xs font-bold ${isSelected ? 'text-[#1D1A22]' : 'text-[#49454F]'}`}>
                      {mood.label}
                    </span>
                    <span className="text-[10px] text-[#79747E] text-center tracking-tight truncate max-w-full">
                      {mood.sub}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* AI 일기 감성 분석 결과 영역 (Gemini 심층 분석 리포트 - 분석 완료 시 노출) */}
        {analysisResult && (
          <section className="bg-[#F3EDF7] rounded-3xl p-5 sm:p-6 shadow-[0px_2px_6px_2px_rgba(103,80,164,0.08)] border border-[#E7E0EB] space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
            {/* 리포트 상단 타이틀 */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E1D7E8] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#6750A4] text-white flex items-center justify-center shadow-sm">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-base sm:text-lg text-[#1D1A22]">
                      AI 감성 심층 분석 리포트
                    </h2>
                    <span className="bg-[#4F378A] text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
                      Gemini 3.1 Flash-Lite
                    </span>
                  </div>
                  <p className="text-xs text-[#79747E]">
                    자연어 심리 맥락 모델링 엔진 실시간 연산 완료
                  </p>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-xs px-3 py-1.5 rounded-full text-xs font-semibold text-[#1D1A22] border border-[#E1D7E8] shadow-xs">
                감정 지수: <span className="text-[#6750A4] font-bold">{analysisResult.sentimentScore}점</span> ({analysisResult.sentimentStatus})
              </div>
            </div>

            {/* 헤드라인 카드 (PRIMARY MOOD SPECTRUM) */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-[#ECE6F0] flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <Leaf className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  PRIMARY MOOD SPECTRUM
                </span>
                <p className="text-sm sm:text-base font-bold text-[#1D1A22] leading-snug">
                  {analysisResult.primaryMoodHeadline}
                </p>
                <p className="text-xs sm:text-sm text-[#49454F] leading-relaxed">
                  {analysisResult.primaryMoodDescription}
                </p>
              </div>
            </div>

            {/* 3단 그리드: 감정 점수 분포, 추출 핵심 키워드, 추천 맞춤 힐링 처방 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              
              {/* 1. 감정 점수 분포 */}
              <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#ECE6F0] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-[#1D1A22] mb-3">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#6750A4]" />
                      감정 점수 분포
                    </span>
                    <span className="text-[10px] text-[#79747E] font-normal">총 100%</span>
                  </div>
                  <div className="space-y-2.5">
                    {analysisResult.scoreBreakdown.map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs text-[#49454F]">
                          <span className="font-medium text-[11px] truncate">{item.name}</span>
                          <span className="font-bold text-[11px] text-[#1D1A22]">{item.percentage}%</span>
                        </div>
                        <div className="w-full bg-[#F3EDF7] h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              idx === 0 ? 'bg-[#6750A4]' : idx === 1 ? 'bg-purple-300' : 'bg-slate-300'
                            }`}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. 추출 핵심 키워드 */}
              <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#ECE6F0] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#1D1A22] mb-3">
                    <Hash className="w-3.5 h-3.5 text-[#6750A4]" />
                    추출 핵심 키워드
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {analysisResult.keywords.map((kw, idx) => (
                      <span
                        key={idx}
                        className="bg-[#F8E7F0] text-[#7A4F5D] text-[11px] font-medium px-2 py-0.8 rounded-lg"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-[10px] text-[#79747E] mt-3 pt-2 border-t border-[#F3EDF7] leading-tight">
                  {analysisResult.keywordsNote}
                </p>
              </div>

              {/* 3. 추천 맞춤 힐링 처방 */}
              <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#ECE6F0] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#1D1A22] mb-3">
                    <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                    추천 맞춤 힐링 처방
                  </div>
                  <div className="space-y-2">
                    {analysisResult.healingPrescriptions.map((pres, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 bg-[#F3EDF7] text-[#1D1A22] text-xs p-2 rounded-xl"
                      >
                        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0 shadow-xs">
                          {renderPrescriptionIcon(pres.icon)}
                        </div>
                        <span className="font-medium text-[11px] leading-tight">{pres.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-[10px] text-[#79747E] mt-3 pt-2 border-t border-[#F3EDF7] leading-tight">
                  {analysisResult.prescriptionsNote}
                </p>
              </div>
            </div>

            {/* Gemini의 따뜻한 공감 한마디 */}
            <div className="bg-[#FDECEF] rounded-2xl p-4 sm:p-5 border border-[#FAD2DC] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#7D5260]">
                <Quote className="w-4 h-4 text-[#7D5260]" />
                Gemini의 따뜻한 공감 한마디
              </div>
              <p className="text-xs sm:text-sm text-[#49454F] leading-relaxed italic">
                {analysisResult.empatheticLetter}
              </p>
            </div>
          </section>
        )}

        {/* 하단 세련된 푸터 및 저작권 안내 */}
        <footer className="pt-6 pb-12 w-full space-y-4">
          <div className="bg-white/80 backdrop-blur-xs rounded-3xl p-5 sm:p-6 border border-[#ECE6F0] shadow-xs space-y-4">
            {/* 상단 보안 및 신뢰성 뱃지 */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#49454F] border-b border-[#F3EDF7] pb-3.5">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-600">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </span>
                <span className="font-medium text-[12px] sm:text-xs text-[#49454F]">
                  모든 일기와 감정 분석 데이터는 기기 및 암호화된 전용 클라우드에 안전하게 보호됩니다.
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#79747E]">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>AI 감성 엔진 온라인</span>
              </div>
            </div>

            {/* 중간 정보 및 빠른 링크 */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1 text-xs text-[#79747E]">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-[#F3EDF7] text-[#6750A4] font-bold text-[11px] tracking-wide">
                  INU
                </span>
                <span className="font-semibold text-[#1D1A22] text-sm tracking-tight">
                  Diary AI Sentiments Analyzer
                </span>
              </div>

              <div className="flex items-center gap-4 text-[11px] text-[#79747E]">
                <button type="button" className="hover:text-[#6750A4] transition-colors">
                  이용약관
                </button>
                <span>·</span>
                <button type="button" className="hover:text-[#6750A4] transition-colors">
                  개인정보처리방침
                </button>
                <span>·</span>
                <button type="button" className="hover:text-[#6750A4] transition-colors">
                  피드백 보내기
                </button>
              </div>
            </div>

            {/* 하단 카피라이트 */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-[#F8F5FA] text-[11px] text-[#9E9A9F]">
              <div className="flex items-center gap-1.5">
                <span>Designed with</span>
                <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                <span className="font-medium text-[#49454F]">
                  Copyright INU Diary AI Sentiments Analyzer by kyonam Choo
                </span>
              </div>
              <div className="text-[10px] text-[#A8A4AB]">
                Powered by Google Gemini 3.1 & Next.js
              </div>
            </div>
          </div>
        </footer>

      </div>

      {/* 구글 시트 저장된 일기 목록 모달 (CRUD 지원) */}
      {isListOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl border border-[#ECE6F0] overflow-hidden">
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F3EDF7]">
              <div className="flex items-center gap-2">
                <Book className="w-5 h-5 text-[#6750A4]" />
                <h2 className="text-lg font-bold text-[#1D1A22]">저장된 일기 목록</h2>
                <span className="text-xs bg-[#F3EDF7] text-[#6750A4] px-2.5 py-0.5 rounded-full font-semibold">
                  {diaryList.length}개
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={fetchDiaryList}
                  disabled={isLoadingList}
                  className="p-1.5 text-[#79747E] hover:text-[#6750A4] hover:bg-[#F3EDF7] rounded-full transition-colors"
                  title="새로고침"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingList ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={() => {
                    setIsListOpen(false);
                    setEditingEntry(null);
                  }}
                  className="p-1.5 text-[#79747E] hover:text-[#1D1A22] hover:bg-[#F3EDF7] rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 모달 본문 - 리스트 */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {isLoadingList ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-3 text-[#79747E]">
                  <Loader2 className="w-8 h-8 animate-spin text-[#6750A4]" />
                  <p className="text-sm">구글 시트에서 일기를 불러오는 중입니다...</p>
                </div>
              ) : diaryList.length === 0 ? (
                <div className="text-center py-16 text-[#79747E] space-y-2">
                  <p className="text-base font-medium">저장된 일기가 없습니다.</p>
                  <p className="text-xs text-[#9E9A9F]">오늘 하루의 이야기를 작성한 후 [저장] 버튼을 눌러보세요.</p>
                </div>
              ) : (
                diaryList.map((entry) => (
                  <div
                    key={entry.timestamp}
                    className="p-4 rounded-2xl bg-[#FAF9FD] border border-[#ECE6F0] space-y-3 transition-all hover:border-[#D0BCFF]"
                  >
                    <div className="flex items-center justify-between text-xs text-[#79747E]">
                      <div className="flex items-center gap-1.5 font-medium text-[#6750A4]">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{entry.datetime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {/* 현재 작성창으로 불러오기 */}
                        <button
                          onClick={() => {
                            setDiaryText(entry.content);
                            setIsListOpen(false);
                          }}
                          className="px-2.5 py-1 text-[11px] text-[#6750A4] bg-white border border-[#E7E0EB] rounded-lg hover:bg-[#F3EDF7] font-medium transition-colors"
                          title="작성창으로 불러와서 분석하기"
                        >
                          본문으로 불러오기
                        </button>
                        {/* 수정 버튼 */}
                        <button
                          onClick={() => {
                            setEditingEntry(entry);
                            setEditContent(entry.content);
                          }}
                          className="p-1.5 text-[#79747E] hover:text-[#6750A4] hover:bg-white rounded-lg transition-colors"
                          title="일기 수정"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        {/* 삭제 버튼 */}
                        <button
                          onClick={() => handleDeleteDiary(entry.timestamp)}
                          disabled={deletingTimestamp === entry.timestamp}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50"
                          title="일기 삭제"
                        >
                          {deletingTimestamp === entry.timestamp ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-[#1D1A22] leading-relaxed whitespace-pre-wrap">
                      {entry.content}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* 수정 인라인 폼 (수정 모드일 때 하단에 표시) */}
            {editingEntry && (
              <div className="p-4 bg-[#F3EDF7] border-t border-[#E7E0EB] space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-[#6750A4]">
                  <span>일기 내용 수정 ({editingEntry.datetime})</span>
                  <button
                    onClick={() => setEditingEntry(null)}
                    className="text-[#79747E] hover:text-[#1D1A22]"
                  >
                    취소
                  </button>
                </div>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={3}
                  className="w-full p-3 rounded-xl border border-[#D0BCFF] bg-white text-sm text-[#1D1A22] focus:outline-none focus:ring-2 focus:ring-[#6750A4]"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditingEntry(null)}
                    className="px-3 py-1.5 text-xs text-[#49454F] bg-white border border-[#CAC4D0] rounded-full hover:bg-gray-50"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleUpdateDiary}
                    disabled={isUpdating}
                    className="flex items-center gap-1.5 px-4 py-1.5 text-xs bg-[#6750A4] text-white rounded-full font-medium hover:bg-[#4F378A] disabled:opacity-50"
                  >
                    {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                    <span>수정 완료</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
