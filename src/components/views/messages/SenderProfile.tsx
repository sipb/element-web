/*
Copyright 2024 New Vector Ltd.
Copyright 2023 The Matrix.org Foundation C.I.C.
Copyright 2015, 2016 OpenMarket Ltd

SPDX-License-Identifier: AGPL-3.0-only OR GPL-3.0-only
Please see LICENSE files in the repository root for full details.
 */

import React from "react";
import { MatrixEvent, MsgType } from "matrix-js-sdk/src/matrix";

import DisambiguatedProfile from "./DisambiguatedProfile";
import { useRoomMemberProfile } from "../../../hooks/room/useRoomMemberProfile";

interface IProps {
    mxEvent: MatrixEvent;
    onClick?(): void;
    withTooltip?: boolean;
}

export default function SenderProfile({ mxEvent, onClick, withTooltip }: IProps): JSX.Element {
    const member = useRoomMemberProfile({
        userId: mxEvent.getSender(),
        member: mxEvent.sender,
    });

    // Zephyr specific stuff!
    let overrideName: string | undefined;
    let overrideDisambiguation: string | undefined;
    const signature = mxEvent.getContent()['im.zephyr.signature'];
    // const isAuthentic = mxEvent.getContent()['im.zephyr.authentic'];
    if (signature) {
        // This is a Zephyr message
        // Not extracting it to a variable to avoid merge conflicts in the future
        const senderId = mxEvent.getSender();
        if (senderId) {
            // Example: "@_zephyr_rgabriel:matrix.mit.edu"
            const kerb = senderId.split(":")[0].substring(9);
            
            // This doesn't look that good, commenting out for now...
            // if (isAuthentic === true) {
                // overrideName = kerb + " ✅";
            // } else {
            overrideName = kerb;
            // }            
            overrideDisambiguation = signature;
        }
    }

    return mxEvent.getContent().msgtype !== MsgType.Emote ? (
        <DisambiguatedProfile
            fallbackName={mxEvent.getSender() ?? ""}
            onClick={onClick}
            member={member}
            colored={true}
            emphasizeDisplayName={true}
            withTooltip={withTooltip}
            overrideName={overrideName}
            overrideDisambiguation={overrideDisambiguation}
        />
    ) : (
        <></>
    );
}
