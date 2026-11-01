import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Paperclip, Phone, Search, Send, Sparkles, Zap } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mono, pageHead } from "@/components/shared";
import { chatMessages, chats } from "@/services/messaging-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/wa/inbox")({
  head: () => pageHead("Live Chat", "Shared WhatsApp team inbox with assignment, notes and AI replies."),
  component: Inbox,
});

const quick = ["Thanks for reaching out! 😊", "Let me check that for you.", "Your issue is resolved. Anything else?"];

function Inbox() {
  const [sel, setSel] = useState("c1");
  const [text, setText] = useState("");
  const [mobileChat, setMobileChat] = useState(false);
  const [msgs, setMsgs] = useState(chatMessages);
  const c = chats.find((x) => x.id === sel)!;
  const list = msgs[sel] ?? [{ from: "user" as const, text: c.last, time: c.time }];
  const send = (t: string) => {
    if (!t.trim()) return;
    setMsgs((m) => ({ ...m, [sel]: [...list, { from: "agent", text: t, time: "now" }] }));
    setText("");
  };
  return (
    <div className="-m-4 grid h-[calc(100dvh-3.5rem-6.5rem)] grid-cols-1 md:h-[calc(100dvh-3.5rem)] border-t md:-m-6 md:grid-cols-[300px_1fr] xl:grid-cols-[300px_1fr_260px]">
      <aside className={cn("min-h-0 flex-col border-r bg-card md:flex", mobileChat ? "hidden" : "flex")}>
        <div className="border-b p-3"><div className="relative"><Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" /><Input placeholder="Search chats" className="h-9 pl-8" /></div>
          <div className="mt-2 flex gap-1 text-xs">{["All", "Mine", "Unassigned", "Bot"].map((f, i) => <span key={f} className={cn("rounded-full border px-2 py-0.5", i === 0 && "border-primary bg-primary text-primary-foreground")}>{f}</span>)}</div></div>
        <ul className="min-h-0 flex-1 overflow-y-auto">
          {chats.map((x) => (
            <li key={x.id}>
              <button onClick={() => { setSel(x.id); setMobileChat(true); }} className={cn("flex w-full gap-3 border-b px-3 py-3 text-left transition-colors", sel === x.id ? "bg-accent" : "hover:bg-muted/50")}>
                <Avatar className="size-9"><AvatarFallback className="text-xs">{x.name.split(" ").map((p) => p[0]).join("")}</AvatarFallback></Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between text-sm"><span className="font-medium">{x.name}</span><span className="text-[11px] text-muted-foreground">{x.time}</span></div>
                  <div className="flex items-center justify-between gap-2"><span className="truncate text-xs text-muted-foreground">{x.last}</span>{x.unread > 0 && <span className="grid size-4 place-items-center rounded-full bg-success text-[10px] text-success-foreground">{x.unread}</span>}</div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <section className={cn("min-h-0 flex-col md:flex", mobileChat ? "flex" : "hidden")}>
        <header className="flex items-center justify-between gap-2 border-b bg-card px-3 py-2.5 md:px-4">
          <button onClick={() => setMobileChat(false)} className="rounded-md p-1 md:hidden" aria-label="Back to chats"><ArrowLeft className="size-4" /></button>
          <div className="min-w-0 flex-1"><div className="text-sm font-medium">{c.name}</div><Mono className="text-xs text-muted-foreground">{c.phone}</Mono></div>
          <div className="flex shrink-0 items-center gap-1 md:gap-2">
            <span className={cn("hidden rounded-full px-2 py-0.5 text-[11px] sm:inline", c.window === "open" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground")}>{c.window === "open" ? "24h window open" : "Window closed — template only"}</span>
            <Button size="icon" variant="ghost" className="size-8" aria-label="Call"><Phone className="size-4" /></Button>
            <Button size="sm" variant="outline" className="h-8">Resolve</Button>
          </div>
        </header>
        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto bg-muted/30 p-4">
          {list.map((m, i) => (
            <div key={i} className={cn("flex", m.from === "user" ? "justify-start" : "justify-end")}>
              <div className={cn("max-w-[70%] rounded-lg px-3 py-2 text-sm shadow-sm", m.from === "user" ? "bg-card" : m.from === "bot" ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground")}>
                {m.from === "bot" && <div className="mb-0.5 text-[10px] font-medium uppercase opacity-70">Bot</div>}
                {m.text}<div className="mt-0.5 text-right text-[10px] opacity-60">{m.time}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t bg-card p-3">
          <div className="mb-2 flex gap-1.5 overflow-x-auto pb-1 md:flex-wrap">
            {quick.map((q) => <button key={q} onClick={() => setText(q)} className="flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-xs hover:bg-muted"><Zap className="size-3" />{q}</button>)}
            <button onClick={() => setText("Yes, you can! Please share the new address and I'll update order #A-20931 before it ships.")} className="flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-primary/40 px-2 py-0.5 text-xs text-primary hover:bg-accent"><Sparkles className="size-3" />AI suggest</button>
          </div>
          <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); send(text); }}>
            <Button type="button" size="icon" variant="ghost" aria-label="Attach"><Paperclip className="size-4" /></Button>
            <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message…" />
            <Button type="submit" size="icon" aria-label="Send"><Send className="size-4" /></Button>
          </form>
        </div>
      </section>
      <aside className="hidden space-y-4 border-l bg-card p-4 text-sm xl:block">
        <div><div className="text-xs text-muted-foreground">Assigned to</div><div className="font-medium">{c.agent}</div></div>
        <div><div className="text-xs text-muted-foreground">Tag</div><span className="rounded bg-muted px-2 py-0.5 text-xs">{c.tag}</span></div>
        <div><div className="text-xs text-muted-foreground">Opt-in</div><div>Subscribed · Website widget</div></div>
        <div><div className="mb-1 text-xs text-muted-foreground">Internal note</div><textarea className="h-24 w-full rounded-md border bg-background p-2 text-xs" placeholder="Only visible to your team" /></div>
      </aside>
    </div>
  );
}
