import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  CheckCheck,
  Phone,
  Sparkles,
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
        },
      ]
    : [
        {
          id: "conv-driver",
          partnerName: activeLines[0]?.driverName || "كابتن أبو مصطفى",
          partnerRole: "driver",
          partnerInfo: `خط ${activeLines[0]?.fromArea || "الزبير"} ← ${activeLines[0]?.toArea || "كرمة علي"}`,
          partnerPhone: activeLines[0]?.driverPhone || "07701234567",
          unreadCount: 1,
          lastMessage: "صباح الخير، سأمر عليكم خلال 10 دقائق جهزوا أنفسكم.",
          lastTime: "07:20 ص",
        },
      ];

  const [conversations] = useState<Conversation[]>(defaultConversations);
  const [activeConvId, setActiveConvId] = useState<string>(defaultConversations[0]?.id || "");
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
          senderName: activeLines[0]?.driverName || "كابتن أبو مصطفى",
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
          senderName: activeLines[0]?.driverName || "كابتن أبو مصطفى",
          senderRole: "driver",
          text: "صباح الخير، سأمر عليكم خلال 10 دقائق جهزوا أنفسكم.",
          timestamp: "07:20 ص",
        },
      ],
    };
  });

  const activeMessages = messages[activeConvId] || [];

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

    // Simulate quick auto-reply after 1.5 seconds if first reply
    if (activeMessages.length < 5) {
      setTimeout(() => {
        const replyText = isDriver
          ? "أهلاً بك، تم استلام رسالتك وسأوافيك بالتفاصيل."
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
      }, 1500);
    }
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
    <div className="flex flex-1 flex-col bg-background">
      <div className="container max-w-4xl flex-1 flex flex-col py-3 sm:py-6">
        {/* Main Chat Container */}
        <div className="card-surface flex flex-1 flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-border shadow-xl min-h-[75vh]">
          {/* Top Chat Header */}
          <div className="flex items-center justify-between border-b border-border bg-card/90 px-4 py-3 sm:px-6 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <DriverAvatar
                name={currentConv.partnerName}
                size="md"
                ring={currentConv.partnerRole === "driver" ? "gold" : "muted"}
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="font-display text-sm sm:text-base font-black text-foreground">
                    {currentConv.partnerName}
                  </h2>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-black",
                      currentConv.partnerRole === "driver"
                        ? "bg-gold/15 text-navy-deep dark:text-gold"
                        : "bg-primary/10 text-primary dark:text-gold"
                    )}
                  >
                    {currentConv.partnerRole === "driver" ? "سائق الخط 🚌" : "طالب 🎓"}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">{currentConv.partnerInfo}</p>
              </div>
            </div>

            {/* Direct Phone Call */}
            <a
              href={`tel:${currentConv.partnerPhone}`}
              className="flex items-center gap-1.5 rounded-xl border border-border bg-muted/40 px-3 py-1.5 text-xs font-bold text-foreground hover:bg-muted active:scale-95 transition-all"
              title="اتصال هاتفي"
            >
              <Phone className="h-3.5 w-3.5 text-primary" />
              <span className="hidden sm:inline">اتصال</span>
            </a>
          </div>

          {/* Conversations Selector for Drivers (if multiple students) */}
          {isDriver && conversations.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto border-b border-border bg-muted/20 px-3 py-2 scrollbar-none">
              <span className="text-[11px] font-bold text-muted-foreground whitespace-nowrap">
                المحادثات:
              </span>
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  type="button"
                  onClick={() => setActiveConvId(conv.id)}
                  className={cn(
                    "flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-1 text-xs font-bold transition-all",
                    activeConvId === conv.id
                      ? "bg-gold text-navy-deep shadow-sm"
                      : "bg-card text-muted-foreground hover:bg-muted/50"
                  )}
                >
                  <span>{conv.partnerName}</span>
                  {conv.unreadCount > 0 && (
                    <span className="grid h-4 w-4 place-items-center rounded-full bg-destructive text-[9px] font-black text-white">
                      {conv.unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Messages Stream Area */}
          <div className="flex-1 space-y-3 overflow-y-auto p-4 sm:p-6 bg-muted/10">
            {/* Safety & Notice Pill */}
            <div className="mx-auto flex max-w-sm items-center justify-center gap-1.5 rounded-full bg-muted/60 px-3 py-1 text-[11px] text-muted-foreground text-center">
              <Sparkles className="h-3 w-3 text-gold" />
              <span>محادثة مباشرة للتنسيق بخصوص مواعيد وانطلاق الخط</span>
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
                      "max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm shadow-sm",
                      isMe
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-card border border-border text-foreground rounded-tl-none"
                    )}
                  >
                    <p className="leading-relaxed">{msg.text}</p>
                    <div
                      className={cn(
                        "mt-1 flex items-center justify-end gap-1 text-[10px]",
                        isMe ? "text-primary-foreground/75" : "text-muted-foreground"
                      )}
                    >
                      <span>{msg.timestamp}</span>
                      {isMe && <CheckCheck className="h-3 w-3" />}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Reply Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto border-t border-border bg-card/60 px-3 py-2 scrollbar-none">
            <span className="text-[10px] font-bold text-muted-foreground whitespace-nowrap">
              ردود سريعة:
            </span>
            {quickReplies.map((reply, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(reply)}
                className="whitespace-nowrap rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] font-semibold text-foreground hover:bg-muted active:scale-95 transition-all"
              >
                {reply}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 border-t border-border bg-card p-3 sm:p-4"
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
              className="h-11 flex-1 rounded-xl border border-input bg-background px-3.5 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-primary-foreground shadow-md transition-all hover:bg-primary/90 disabled:opacity-40 active:scale-95"
              aria-label="إرسال"
            >
              <Send className="h-4 w-4 rtl:rotate-180" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
