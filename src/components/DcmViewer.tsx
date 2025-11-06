import { useEffect, useRef, useState } from "react";
import * as cornerstone from "cornerstone-core";
import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import * as dicomParser from "dicom-parser";

cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
cornerstoneWADOImageLoader.configure({
  useWebWorkers: false,
});

interface DcmViewerProps {
  imageUrl: string;
  className?: string;
}

export const DcmViewer = ({ imageUrl, className }: DcmViewerProps) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!viewerRef.current) return;

    const element = viewerRef.current;

    // CRITICAL: Set dimensions before enabling
    element.style.width = "512px";
    element.style.height = "512px";

    cornerstone.enable(element);

    const loadImage = async () => {
      try {
        setLoading(true);
        setError(null);

        const imageId = `wadouri:${imageUrl}`;
        console.log("Loading DICOM:", imageUrl);

        const image = await cornerstone.loadImage(imageId);
        cornerstone.displayImage(element, image);
        cornerstone.resize(element, true);

        setLoading(false);
      } catch (error) {
        console.error("Error loading DCM:", error);
        setError("Failed to load DICOM image");
        setLoading(false);
      }
    };

    loadImage();

    return () => {
      try {
        cornerstone.disable(element);
      } catch (e) {
        console.error("Error disabling:", e);
      }
    };
  }, [imageUrl]);

  return (
    <div
      className={className}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000",
        minHeight: "512px",
      }}
    >
      {loading && (
        <div style={{ color: "#fff", position: "absolute" }}>
          Loading DICOM...
        </div>
      )}
      {error && (
        <div style={{ color: "#f00", position: "absolute" }}>{error}</div>
      )}
      <div ref={viewerRef} />
    </div>
  );
};
