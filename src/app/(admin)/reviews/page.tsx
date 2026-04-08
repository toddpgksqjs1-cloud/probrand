"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Star, MessageSquare, ThumbsUp, ThumbsDown, Minus,
  Sparkles, Send,
} from "lucide-react";
import { useAdminStore } from "@/lib/store/admin-store";
import { toast } from "sonner";

export default function ReviewsPage() {
  const reviews = useAdminStore((s) => s.reviews);
  const addReviewReply = useAdminStore((s) => s.addReviewReply);
  const [selectedReview, setSelectedReview] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const positiveCount = reviews.filter((r) => r.sentiment === "positive").length;
  const negativeCount = reviews.filter((r) => r.sentiment === "negative").length;
  const totalReviews = reviews.length;
  const positiveRate = totalReviews > 0 ? Math.round((positiveCount / totalReviews) * 100) : 0;
  const negativeRate = totalReviews > 0 ? Math.round((negativeCount / totalReviews) * 100) : 0;
  const avgRating = totalReviews > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1) : "0";
  const repliedCount = reviews.filter((r) => r.reply).length;
  const replyRate = totalReviews > 0 ? Math.round((repliedCount / totalReviews) * 100) : 0;

  const handleAIReply = (reviewId: string) => {
    const review = reviews.find((r) => r.id === reviewId);
    if (review?.aiReplyDraft) {
      setReplyText(review.aiReplyDraft);
    } else {
      setReplyText("방문해주셔서 감사합니다! 소중한 리뷰 감사드리며, 더 좋은 맛과 서비스로 보답하겠습니다.");
    }
    setSelectedReview(reviewId);
    toast.info("AI 답글이 생성되었습니다. 수정 후 게시하세요.");
  };

  const handleSubmitReply = (reviewId: string) => {
    if (!replyText.trim()) {
      toast.error("답글 내용을 입력해주세요.");
      return;
    }
    addReviewReply(reviewId, replyText);
    setSelectedReview(null);
    setReplyText("");
    toast.success("답글이 게시되었습니다.");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">리뷰 관리</h1>
          <p className="text-slate-400 text-sm mt-1">고객 리뷰를 한 곳에서 관리하세요</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-white">{totalReviews}</p>
            <p className="text-slate-500 text-xs">총 리뷰</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-1">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span className="text-2xl font-bold text-white">{avgRating}</span>
            </div>
            <p className="text-slate-500 text-xs">평균 평점</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">{positiveRate}%</p>
            <p className="text-slate-500 text-xs">긍정 리뷰</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-400">{negativeRate}%</p>
            <p className="text-slate-500 text-xs">부정 리뷰</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-400">{replyRate}%</p>
            <p className="text-slate-500 text-xs">답글 비율</p>
          </CardContent>
        </Card>
      </div>

      {/* Reviews List */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-lg">전체 리뷰</CardTitle>
            <div className="flex gap-2">
              {["전체", "네이버", "구글", "배달앱"].map((platform) => (
                <Badge key={platform} variant="secondary" className="bg-white/5 text-slate-400 border-0 cursor-pointer hover:bg-white/10">
                  {platform}
                </Badge>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {reviews.map((review) => (
            <div key={review.id} className="p-4 rounded-xl bg-white/3 border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-sm font-bold">
                    {review.author[0]}
                  </div>
                  <div>
                    <span className="text-white text-sm font-medium">{review.author}</span>
                    <div className="flex gap-0.5 mt-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className={`w-3 h-3 ${j < review.rating ? "text-amber-400 fill-amber-400" : "text-slate-600"}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-white/5 text-slate-500 border-0 text-xs">
                    {review.platform}
                  </Badge>
                  {review.sentiment && (
                    <Badge className={`text-xs border-0 ${
                      review.sentiment === "positive" ? "bg-emerald-500/10 text-emerald-400" :
                      review.sentiment === "negative" ? "bg-red-500/10 text-red-400" :
                      "bg-slate-500/10 text-slate-400"
                    }`}>
                      {review.sentiment === "positive" ? <ThumbsUp className="w-3 h-3" /> :
                       review.sentiment === "negative" ? <ThumbsDown className="w-3 h-3" /> :
                       <Minus className="w-3 h-3" />}
                    </Badge>
                  )}
                  <span className="text-slate-500 text-xs">{review.date}</span>
                </div>
              </div>

              <p className="text-slate-300 text-sm mb-3">{review.content}</p>

              {review.keywords && (
                <div className="flex gap-1 mb-3">
                  {review.keywords.map((kw, j) => (
                    <span key={j} className="text-xs px-2 py-0.5 rounded bg-white/5 text-slate-500">
                      {kw}
                    </span>
                  ))}
                </div>
              )}

              {review.reply ? (
                <div className="p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/10">
                  <p className="text-xs text-indigo-400 mb-1">사장님 답글</p>
                  <p className="text-slate-300 text-sm">{review.reply}</p>
                </div>
              ) : selectedReview === review.id ? (
                <div className="space-y-2">
                  <Textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="답글을 작성하세요..."
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 min-h-[80px]"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500" onClick={() => handleSubmitReply(review.id)}>
                      <Send className="w-4 h-4 mr-1" /> 답글 게시
                    </Button>
                    <Button size="sm" variant="ghost" className="text-slate-400" onClick={() => { setSelectedReview(null); setReplyText(""); }}>
                      취소
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" className="text-indigo-400 hover:text-indigo-300" onClick={() => handleAIReply(review.id)}>
                    <Sparkles className="w-4 h-4 mr-1" /> AI 답글 추천
                  </Button>
                  <Button size="sm" variant="ghost" className="text-slate-400" onClick={() => setSelectedReview(review.id)}>
                    <MessageSquare className="w-4 h-4 mr-1" /> 직접 답글
                  </Button>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
