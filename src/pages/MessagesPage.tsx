import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  CheckCheck,
  Phone,
  Sparkles,
  ArrowRight,
  Search,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { usePlatform } from "../context/PlatformContext";
import { DriverAvatar } from "../components/common/DriverAvatar";
import { cn } from "../utils/formatters";

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: "student" | "driver";
  text: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  partnerName: string;
  partnerRole: "student" | "driver";
  partnerInfo: string;
  partnerPhone: string;
  unreadCount: number;
  lastMessage: string;
  lastTime: string;
  avatarUrl?: string;
}

export const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const { activeLines } = usePlatform();
  const isDriver = user?.role === "driver";

  // Conversations list
  const defaultConversations: Conversation[] = isDriver
    ? [
        {
          id: "conv-1",
          partnerName: "مريم العبادي",
          partnerRole: "student",
          partnerInfo: "كلية الهندسة • الزبير",
          partnerPhone: "07801122334",
          unreadCount: 1,
          lastMessage: "السلام عليكم كابتن، متى وقت الانطلاق من نقطة التجمع؟",
          lastTime: "07:15 ص",
          avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
        },
        {
          id: "conv-2",
          partnerName: "كرار حيدر الجابري",
          partnerRole: "student",
          partnerInfo: "كلية العلوم • ساحة الاحتفالات",
          partnerPhone: "07709988776",
          unreadCount: 0,
          lastMessage: "تم كابتن، أنا متواجد عند المحطة الآن.",
          lastTime: "أمس",
          avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
        },
        {
          id: "conv-3",
          partnerName: "فاطمة الزهراء علي",
          partnerRole: "student",
          partnerInfo: "كلية الصيدلة • الطوبة",
          partnerPhone: "07812233445",
          unreadCount: 0,
          lastMessage: "شكراً كابتن على الالتزام بالوقت اليوم.",
          lastTime: "منذ يومين",
          avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
        },
      ]
    : [
        {
          id: "conv-driver",
          partnerName: activeLines[0]?.driverName || "كابتن أبو مصطفى الحلفي",
          partnerRole: "driver",
          partnerInfo: `خط ${activeLines[0]?.fromArea || "الزبير"} ← ${activeLines[0]?.toArea || "كرمة علي"}`,
          partnerPhone: activeLines[0]?.driverPhone || "07701234567",
          unreadCount: 1,
          lastMessage: "صباح الخير، سأمر عليكم خلال 10 دقائق جهزوا أنفسكم.",
          lastTime: "07:20 ص",
          avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
        },
      ];

  const [conversations] = useState<Conversation[]>(defaultConversations);
  const [activeConvId, setActiveConvId] = useState<string>(defaultConversations[0]?.id || "");
  const [mobileView, setMobileView] = useState<"list" | "chat">("chat");
  const [searchQuery, setSearchQuery] = useState("");
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Selected conversation
  const currentConv = conversations.find((c) => c.id === activeConvId) || conversations[0];

  // Chat message history per conversation
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(() => {
    return {
      "conv-1": [
        {
          id: "m-1",
          senderId: "student-1",
          senderName: "مريم العبادي",
          senderRole: "student",
          text: "السلام عليكم كابتن، متى وقت الانطلاق من نقطة التجمع؟",
          timestamp: "07:15 ص",
        },
      ],
      "conv-2": [
        {
          id: "m-2",
          senderId: "driver-me",
          senderName: "أنا",
          senderRole: "driver",
          text: "صباح الخير كرار، هل وصلت للنقطة؟",
          timestamp: "أمس 07:10 ص",
        },
        {
          id: "m-3",
          senderId: "student-2",
          senderName: "كرار حيدر الجابري",
          senderRole: "student",
          text: "تم كابتن، أنا متواجد عند المحطة الآن.",
          timestamp: "أمس 07:12 ص",
        },
      ],
      "conv-3": [
        {
          id: "m-4",
          senderId: "student-3",
          senderName: "فاطمة الزهراء علي",
          senderRole: "student",
          text: "شكراً كابتن على الالتزام بالوقت اليوم.",
          timestamp: "منذ يومين",
        },
      ],
      "conv-driver": [
        {
          id: "md-1",
          senderId: "driver-1",
          senderName: activeLines[0]?.driverName || "كابتن أبو مصطفى الحلفي",
          senderRole: "driver",
          text: "أهلاً بك معنا في الخط الجامعي! وقت الانطلاق الصباحي 07:30 ص.",
          timestamp: "07:05 ص",
        },
        {
          id: "md-2",
          senderId: "student-me",
          senderName: "أنا",
          senderRole: "student",
          text: "تمام كابتن، سأكون في نقطة التجمع قبل الوقت إن شاء الله.",
          timestamp: "07:12 ص",
        },
        {
          id: "md-3",
          senderId: "driver-1",
          senderName: activeLines[0]?.driverName || "كابتن أبو مصطفى الحلفي",
          senderRole: "driver",
          text: "صباح الخير، سأمر عليكم خلال 10 دقائق جهزوا أنفسكم.",
          timestamp: "07:20 ص",
        },
      ],
    };
  });

  const activeMessages = messages[activeConvId] || [];

  // Filtered conversations
  const filteredConversations = conversations.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return c.partnerName.toLowerCase().includes(q) || c.partnerInfo.toLowerCase().includes(q);
  });

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: "me",
      senderName: user?.name || (isDriver ? "السائق" : "الطالب"),
      senderRole: isDriver ? "driver" : "student",
      text,
      timestamp: new Date().toLocaleTimeString("ar-IQ", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => ({
      ...prev,
      [activeConvId]: [...(prev[activeConvId] || []), newMsg],
    }));

    setInputText("");

    // Simulate quick auto-reply after 1.5 seconds if first few messages
    if (activeMessages.length < 5) {
      setTimeout(() => {
        const replyText = isDriver
          ? "أهلاً بك، تم استلام رسالتك وسأوافيك بالتفاصيل فوراً."
          : "شكراً لك كابتن، وصلت الرسالة.";

        const autoReply: ChatMessage = {
          id: `reply-${Date.now()}`,
          senderId: currentConv.id,
          senderName: currentConv.partnerName,
          senderRole: currentConv.partnerRole,
          text: replyText,
          timestamp: new Date().toLocaleTimeString("ar-IQ", { hour: "2-digit", minute: "2-digit" }),
        };

        setMessages((prev) => ({
          ...prev,
          [activeConvId]: [...(prev[activeConvId] || []), autoReply],
        }));
      }, 1400);
    }
  };

  const handleSelectConv = (id: string) => {
    setActiveConvId(id);
    setMobileView("chat");
  };

  // Quick chips depending on role
  const quickReplies = isDriver
    ? [
        "أنا في الطريق الآن 🚗",
        "وصلت لنقطة التجمع 📍",
        "سأنتظر دقيقتين فقط ⏱️",
        "تحركنا باتجاه الجامعة 🎓",
      ]
    : [
        "أنا عند نقطة التجمع 📍",
        "هل أنت في الطريق؟ ⏳",
        "سأتأخر 3 دقائق ⏱️",
        "شكراً كابتن 🙏",
      ];

  return (
    <div className="flex flex-1 flex-col h-full w-full min-h-0 bg-background overflow-hidden">
      <div className="flex-1 flex w-full h-full min-h-0 overflow-hidden max-w-6xl mx-auto lg:p-4">
        {/* Main Chat Box Container */}
        <div className="flex flex-1 w-full h-full min-h-0 bg-card border-0 lg:border lg:border-border lg:rounded-3xl shadow-none lg:shadow-xl overflow-hidden">
          {/* ============================================================== */}
          {/* 1. Conversations Sidebar (Hidden on mobile if viewing chat)     */}
          {/* ============================================================== */}
          <div
            className={cn(
              "w-full lg:w-80 xl:w-96 flex flex-col border-e border-border bg-card h-full min-h-0 shrink-0",
              mobileView === "chat" ? "hidden lg:flex" : "flex"
            )}
          >
            {/* Sidebar Header */}
            <div className="p-3.5 sm:p-4 border-b border-border bg-card/90 pt-[max(0.75rem,env(safe-area-inset-top,0px))]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#286058]/15 text-[#286058] flex items-center justify-center font-bold">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <h1 className="font-display text-base sm:text-lg font-black text-foreground">
                    المحادثات والرسائل
                  </h1>
                </div>
                <span className="text-[11px] font-black bg-[#eaf4f2] text-[#286058] px-2.5 py-0.5 rounded-full border border-[#286058]/20">
                  {conversations.length} نشطة
                </span>
              </div>

              {/* Search in conversations */}
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث بالاسم أو الكلية..."
                  className="w-full bg-muted/50 border border-border/80 rounded-xl pr-9 pl-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#286058]"
                />
              </div>
            </div>

            {/* Conversations Scroll List */}
            <div className="flex-1 overflow-y-auto divide-y divide-border/60">
              {filteredConversations.map((conv) => {
                const isSelected = conv.id === activeConvId;
                return (
                  <button
                    key={conv.id}
                    type="button"
                    onClick={() => handleSelectConv(conv.id)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3.5 text-start transition-all",
                      isSelected
                        ? "bg-[#eaf4f2]/70 dark:bg-[#286058]/20"
                        : "hover:bg-muted/40"
                    )}
                  >
                    <div className="relative shrink-0">
                      {conv.avatarUrl ? (
                        <img
                          src={conv.avatarUrl}
                          alt={conv.partnerName}
                          className="h-12 w-12 rounded-2xl object-cover border border-border shadow-sm"
                        />
                      ) : (
                        <DriverAvatar
                          name={conv.partnerName}
                          size="md"
                          ring={conv.partnerRole === "driver" ? "gold" : "muted"}
                        />
                      )}
                      <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-card" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className="font-bold text-xs sm:text-sm text-foreground truncate">
                          {conv.partnerName}
                        </h4>
                        <span className="text-[10px] text-muted-foreground font-mono shrink-0">
                          {conv.lastTime}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate mb-1">
                        {conv.lastMessage}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-medium text-[#286058] dark:text-[#52b7a9] bg-muted/60 px-2 py-0.5 rounded-md truncate max-w-[170px]">
                          {conv.partnerInfo}
                        </span>
                        {conv.unreadCount > 0 && (
                          <span className="grid h-4 w-4 place-items-center rounded-full bg-[#286058] text-[9px] font-black text-white shrink-0">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ============================================================== */}
          {/* 2. Active Chat Stream Area (Master-Detail)                     */}
          {/* ============================================================== */}
          <div
            className={cn(
              "flex-1 flex flex-col h-full min-h-0 bg-background overflow-hidden",
              mobileView === "list" ? "hidden lg:flex" : "flex"
            )}
          >
            {/* Top Chat Header */}
            <div className="flex items-center justify-between border-b border-border bg-card/95 px-3 sm:px-5 py-2.5 backdrop-blur-md shrink-0 pt-[max(0.6rem,env(safe-area-inset-top,0px))]">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                {/* Back button to list on mobile if multiple conversations */}
                {isDriver && (
                  <button
                    type="button"
                    onClick={() => setMobileView("list")}
                    className="flex lg:hidden h-8 w-8 items-center justify-center rounded-xl bg-muted/60 hover:bg-muted text-foreground active:scale-95 transition-all shrink-0"
                    title="الرجوع لقائمة المحادثات"
                    aria-label="الرجوع"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}

                {/* Avatar with live status */}
                <div className="relative shrink-0">
                  {currentConv.avatarUrl ? (
                    <img
                      src={currentConv.avatarUrl}
                      alt={currentConv.partnerName}
                      className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl object-cover border border-border shadow-sm"
                    />
                  ) : (
                    <DriverAvatar
                      name={currentConv.partnerName}
                      size="md"
                      ring={currentConv.partnerRole === "driver" ? "gold" : "muted"}
                    />
                  )}
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-card" />
                </div>

                {/* Partner Details */}
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h2 className="font-display text-xs sm:text-sm font-black text-foreground truncate">
                      {currentConv.partnerName}
                    </h2>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[9px] sm:text-[10px] font-black shrink-0",
                        currentConv.partnerRole === "driver"
                          ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                          : "bg-[#286058]/10 text-[#286058] dark:text-[#52b7a9]"
                      )}
                    >
                      {currentConv.partnerRole === "driver" ? "كابتن الخط 🚌" : "طالب جامعي 🎓"}
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-muted-foreground truncate">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold ml-1">● متصل الآن</span>
                    • {currentConv.partnerInfo}
                  </p>
                </div>
              </div>

              {/* Direct Phone Call Button */}
              <a
                href={`tel:${currentConv.partnerPhone}`}
                className="flex items-center gap-1.5 rounded-xl border border-border bg-card hover:bg-muted/80 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-foreground active:scale-95 transition-all shrink-0 shadow-sm"
                title="اتصال هاتفي مباشر"
              >
                <Phone className="h-3.5 w-3.5 text-[#286058]" />
                <span className="hidden sm:inline text-xs">اتصال</span>
              </a>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-3 sm:p-5 space-y-3 bg-[#f8f9fa] dark:bg-muted/10 min-h-0">
              {/* Notice Banner */}
              <div className="mx-auto flex max-w-xs sm:max-w-sm items-center justify-center gap-1.5 rounded-full bg-card/90 border border-border/80 px-3 py-1 text-[10px] text-muted-foreground text-center shadow-xs">
                <Sparkles className="h-3 w-3 text-amber-500 shrink-0" />
                <span className="truncate">محادثة مشفرة للتنسيق بخصوص مواعيد الخط</span>
              </div>

              {activeMessages.map((msg) => {
                const isMe = msg.senderId === "me" || msg.senderRole === user?.role;
                return (
                  <div
                    key={msg.id}
                    className={cn("flex flex-col", isMe ? "items-start" : "items-end")}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] sm:max-w-[70%] rounded-2xl px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm shadow-sm",
                        isMe
                          ? "bg-[#286058] text-white rounded-tr-none shadow-[0_2px_8px_rgba(40,96,88,0.2)]"
                          : "bg-card border border-border/80 text-foreground rounded-tl-none"
                      )}
                    >
                      <p className="leading-relaxed break-words">{msg.text}</p>
                      <div
                        className={cn(
                          "mt-1 flex items-center justify-end gap-1 text-[9px] sm:text-[10px]",
                          isMe ? "text-white/80" : "text-muted-foreground"
                        )}
                      >
                        <span className="font-mono">{msg.timestamp}</span>
                        {isMe && <CheckCheck className="h-3 w-3" />}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Reply Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto border-t border-border bg-card/95 px-3 py-1.5 no-scrollbar shrink-0">
              <span className="text-[10px] font-bold text-muted-foreground whitespace-nowrap shrink-0">
                رد سريع:
              </span>
              {quickReplies.map((reply, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(reply)}
                  className="whitespace-nowrap rounded-xl border border-border bg-background hover:bg-muted px-2.5 py-1 text-[11px] font-bold text-foreground active:scale-95 transition-all shrink-0"
                >
                  {reply}
                </button>
              ))}
            </div>

            {/* Bottom Message Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2 border-t border-border bg-card p-2 sm:p-3 shrink-0"
            >
              <input
                type="text"
                placeholder={
                  isDriver
                    ? "اكتب رسالة إلى الطالب..."
                    : "اكتب رسالتك إلى كابتن الخط..."
                }
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="h-10 sm:h-11 flex-1 rounded-xl sm:rounded-2xl border border-input bg-background px-3.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#286058] transition-all"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="grid h-10 w-10 sm:h-11 sm:w-11 place-items-center rounded-xl sm:rounded-2xl bg-[#286058] text-white shadow-md transition-all hover:bg-[#204e47] disabled:opacity-40 active:scale-95 shrink-0"
                aria-label="إرسال الرسالة"
              >
                <Send className="h-4 w-4 rtl:rotate-180" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
