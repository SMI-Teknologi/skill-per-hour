"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DeviceSettings,
  VideoPreview,
  useCall,
} from "@stream-io/video-react-sdk";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useUser } from "@clerk/nextjs";

const MeetingSetup = ({
  setIsSetupComplete,
}: {
  setIsSetupComplete: (value: boolean) => void;
}) => {
  const call = useCall();
  const router = useRouter();
  const { user } = useUser();

  if (!call) {
    throw new Error(
      "useStreamCall must be used within a StreamCall component."
    );
  }
  if (!user) throw new Error("User not found");

  const [isMicCamToggled, setIsMicCamToggled] = useState(false);

  useEffect(() => {
    if (isMicCamToggled) {
      call.camera.disable();
      call.microphone.disable();
    } else {
      call.camera.enable();
      call.microphone.enable();
    }
  }, [isMicCamToggled, call.camera, call.microphone]);

  const invitationLink = `${window.location.href}?invite=${user.id}`;

  return (
    <div className="flex flex-col">
      <div className="flex justify-end">
        <Button
          className="rounded-md bg-red-500 px-4 py-2.5 text-white"
          onClick={() => {
            router.back();
          }}
        >
          <ArrowLeft size={20} />
          Go Back
        </Button>
      </div>
      <div className="text-dark100_light900 mx-auto flex size-full max-w-5xl flex-col items-center justify-center gap-3">
        <h1 className="text-center text-2xl font-bold">Getting Ready</h1>
        <div className="px-12">
          <VideoPreview />
        </div>
        <div className="flex items-center justify-center gap-3">
          <label className="flex items-center justify-center gap-2 font-medium">
            <input
              type="checkbox"
              checked={isMicCamToggled}
              onChange={(e) => setIsMicCamToggled(e.target.checked)}
            />
            Join with mic and camera off
          </label>
          <DeviceSettings />
        </div>
        <Button
          className="primary-gradient rounded-md px-4 py-2.5 text-white"
          onClick={() => {
            call.join();
            setIsSetupComplete(true);
          }}
        >
          Join Video Call
        </Button>
        <Button
          className="rounded-md bg-dark-500 px-4 py-2.5 text-white"
          onClick={() => {
            navigator.clipboard.writeText(invitationLink);
            toast({
              title: "Link Copied",
              variant: "default",
            });
          }}
        >
          Copy Invitation Link
        </Button>
      </div>
    </div>
  );
};

export default MeetingSetup;
