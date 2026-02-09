import { useState } from "react";
import Header from "@/components/Header";
import UploadTab from "@/components/UploadTab";
import LiveRecordTab from "@/components/LiveRecordTab";
import HistoryTab from "@/components/HistoryTab";
import MethodologyTab from "@/components/MethodologyTab";
import type { PredictionResult } from "@/lib/audio-utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const Index = () => {
  const [history, setHistory] = useState<PredictionResult[]>([]);

  const addResult = (result: PredictionResult) => {
    setHistory((prev) => [result, ...prev]);
  };

  return (
    <div className="min-h-screen pb-16">
      <div className="max-w-3xl mx-auto px-4">
        <Header />

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="w-full bg-muted/30 p-1 rounded-xl mb-6 grid grid-cols-4">
            <TabsTrigger value="upload" className="tab-trigger data-[state=active]:shadow-none">
              📁 Upload
            </TabsTrigger>

            <TabsTrigger value="record" className="tab-trigger data-[state=active]:shadow-none">
              🎙️ Record
            </TabsTrigger>

            <TabsTrigger value="history" className="tab-trigger data-[state=active]:shadow-none">
              📊 History ({history.length})
            </TabsTrigger>

            <TabsTrigger value="methodology" className="tab-trigger data-[state=active]:shadow-none">
              📖 Method
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <UploadTab onResult={addResult} />
          </TabsContent>

          <TabsContent value="record">
            <LiveRecordTab onResult={addResult} />
          </TabsContent>

          <TabsContent value="history">
            <HistoryTab history={history} onClear={() => setHistory([])} />
          </TabsContent>

          <TabsContent value="methodology">
            <MethodologyTab />
          </TabsContent>
        </Tabs>

        {/* ===== UPDATED FOOTER ===== */}
        <div className="text-center mt-12 text-muted-foreground/40 text-xs font-mono space-y-1">
          <div>
            CTDD-CDSC SpeechID • Final Year Project • 2026
          </div>

          <div className="text-center mt-12 text-muted-foreground/40 text-xs font-mono space-y-1">
            SUPERVISED BY : ASSOC. PROF. DR.VIKNESWARAN VIJEAN | UNIVERSITI MALAYSIA PERLIS<br/>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Index;
