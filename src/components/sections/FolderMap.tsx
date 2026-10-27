import React from "react";
import { MODULES, pad2, folderUrl } from "@/lib/data";
import { Icon } from "@/components/ui/Icons";

export default function FolderMap() {
  return (
    <div className="folder-map">
      {MODULES.map((m) => (
        <div key={m.n} className="fm-row">
          <span className="fn">{m.folder}</span>
          <span className="ft">
            {pad2(m.n)} &middot; {m.title}
          </span>
          <span className="go">
            <a
              className="mini-link"
              href={folderUrl(m.folder)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Folder <Icon name="ext" />
            </a>
          </span>
        </div>
      ))}
    </div>
  );
}
