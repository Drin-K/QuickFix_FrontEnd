import { conversationService } from "@/services/conversation.service";
import type { ConversationListItem } from "@/types/conversation.types";
import { getAuthUser, isAuthenticated } from "@/utils/auth";
import { type FormEvent, useEffect, useMemo, useState } from "react";

const getConversationTitle = (
  conversation: ConversationListItem,
  role?: string,
) => {
  if (role === "provider") {
    return conversation.clientUser?.fullName ?? "Client conversation";
  }

  return conversation.provider?.displayName ?? "Provider conversation";
};

const getConversationSubtitle = (
  conversation: ConversationListItem,
  role?: string,
) => {
  if (role === "provider") {
    return conversation.clientUser?.email ?? "Client inquiry";
  }

  return conversation.provider?.description ?? "Provider conversation";
};

type OpenConversationEvent = CustomEvent<{
  conversation?: ConversationListItem;
}>;

export const ConversationsLauncher = () => {
  const user = getAuthUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [activeConversation, setActiveConversation] =
    useState<ConversationListItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [draftMessage, setDraftMessage] = useState("");

  const canUseInbox =
    isAuthenticated() && (user?.role === "client" || user?.role === "provider");

  const sortedConversations = useMemo(
    () =>
      [...conversations].sort(
        (first, second) =>
          new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime(),
      ),
    [conversations],
  );

  useEffect(() => {
    if (!canUseInbox || !isOpen) {
      return;
    }

    let isMounted = true;

    const loadConversations = async () => {
      try {
        setIsLoading(true);
        const response = await conversationService.getMyConversations();

        if (isMounted) {
          setConversations(response.conversations);
          setActiveConversation((currentConversation) => {
            if (currentConversation) {
              return currentConversation;
            }

            return response.conversations[0] ?? null;
          });
        }
      } catch {
        if (isMounted) {
          setConversations([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadConversations();

    return () => {
      isMounted = false;
    };
  }, [canUseInbox, isOpen]);

  useEffect(() => {
    const handleOpenConversation = (event: Event) => {
      const conversation = (event as OpenConversationEvent).detail?.conversation;

      setIsOpen(true);
      setIsExpanded(true);

      if (conversation) {
        setActiveConversation(conversation);
        setConversations((currentConversations) => {
          const exists = currentConversations.some(
            (currentConversation) => currentConversation.id === conversation.id,
          );

          if (exists) {
            return currentConversations.map((currentConversation) =>
              currentConversation.id === conversation.id
                ? conversation
                : currentConversation,
            );
          }

          return [conversation, ...currentConversations];
        });
      }
    };

    window.addEventListener("quickfix:open-conversation", handleOpenConversation);

    return () => {
      window.removeEventListener(
        "quickfix:open-conversation",
        handleOpenConversation,
      );
    };
  }, []);

  const handleComposerSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  if (!canUseInbox) {
    return null;
  }

  return (
    <aside
      className={`conversation-launcher ${
        isExpanded ? "conversation-launcher--expanded" : ""
      }`}
      aria-label="Conversation inbox"
    >
      {isOpen ? (
        <div className="conversation-launcher__panel">
          <div className="conversation-launcher__header">
            <div className="conversation-launcher__title">
              <span className="conversation-launcher__brand">
                
              </span>

              <div>
                <strong>
                  {activeConversation
                    ? getConversationTitle(activeConversation, user?.role)
                    : "QuickFix Messages"}
                </strong>
                <span>
                  {activeConversation
                    ? getConversationSubtitle(activeConversation, user?.role)
                    : `${conversations.length} conversation(s)`}
                </span>
              </div>
            </div>
            <div className="conversation-launcher__controls">
              <button
                aria-label={
                  isExpanded ? "Shrink conversations panel" : "Expand conversations panel"
                }
                className="conversation-launcher__icon-button"
                type="button"
                onClick={() => setIsExpanded((currentValue) => !currentValue)}
              >
                {isExpanded ? "_" : "+"}
              </button>
              <button
                aria-label="Close conversations"
                className="conversation-launcher__icon-button"
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setIsExpanded(false);
                }}
              >
                x
              </button>
            </div>
          </div>

          <div className="conversation-launcher__body">
            <div className="conversation-launcher__rail">
              {isLoading ? <p>Loading conversations...</p> : null}

              {!isLoading && sortedConversations.length === 0 ? (
                <p>No conversations yet. Start one from a service card.</p>
              ) : null}

              {!isLoading
                ? sortedConversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      className={`conversation-launcher__item ${
                        activeConversation?.id === conversation.id ? "is-active" : ""
                      }`}
                      type="button"
                      onClick={() => setActiveConversation(conversation)}
                    >
                      <span className="conversation-launcher__avatar">
                        {getConversationTitle(conversation, user?.role).slice(0, 1)}
                      </span>
                      <span>
                        <strong>{getConversationTitle(conversation, user?.role)}</strong>
                        <small>Conversation #{conversation.id}</small>
                      </span>
                    </button>
                  ))
                : null}
            </div>

            <div className="conversation-launcher__chat">
              {activeConversation ? (
                <>
                  <div className="conversation-launcher__thread">
                    <div className="conversation-launcher__system">
                      Conversation opened. Text message history connects in S4-D2.
                    </div>
                    <div className="conversation-launcher__bubble conversation-launcher__bubble--remote">
                      Hi, thanks for reaching out. How can I help?
                    </div>
                    <div className="conversation-launcher__bubble conversation-launcher__bubble--local">
                      I would like to ask about this service.
                    </div>
                  </div>

                  <form
                    className="conversation-launcher__composer"
                    onSubmit={handleComposerSubmit}
                  >
                    <input
                      aria-label="Message text"
                      placeholder="Write a message..."
                      type="text"
                      value={draftMessage}
                      onChange={(event) => setDraftMessage(event.target.value)}
                    />
                    <button disabled type="submit">
                      Send
                    </button>
                  </form>
                </>
              ) : (
                <div className="conversation-launcher__empty-chat">
                  <strong>Select a conversation</strong>
                  <span>Choose a contact from the left to continue.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}

      <button
        aria-label="Open conversations"
        className="conversation-launcher__button"
        type="button"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
      >
        <span className="conversation-launcher__mark">QF</span>
        <span>Messages</span>
      </button>
    </aside>
  );
};
