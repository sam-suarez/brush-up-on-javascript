// Flat, ordered index of every challenge from the catalog (no topic chunks need to load).
import { allTopics } from "../content/catalog";
import { challengeId, type ChallengeMeta, type CourseSlug, type TopicMeta } from "../content/types";

export interface ChallengeRef {
  id: string;
  course: CourseSlug;
  topic: TopicMeta;
  challenge: ChallengeMeta;
  /** Position within the topic, 0-based. */
  index: number;
}

export const challengeRefs: ChallengeRef[] = allTopics.flatMap(({ course, topic }) =>
  topic.challenges.map((challenge, index) => ({
    id: challengeId(course, topic.slug, challenge.slug),
    course,
    topic,
    challenge,
    index,
  })),
);

export const refById = new Map(challengeRefs.map((ref) => [ref.id, ref]));

export const challengePath = (ref: Pick<ChallengeRef, "course" | "topic" | "challenge">) =>
  `/${ref.course}/${ref.topic.slug}/${ref.challenge.slug}`;
