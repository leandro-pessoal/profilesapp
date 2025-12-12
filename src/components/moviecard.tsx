// src/components/MovieCard.tsx
import React from "react";
import { Button, Card, Flex, Text } from "@aws-amplify/ui-react";
import { logInteraction, Movie } from "../api";

type Props = {
  movie: Movie;
  userId: number;
  fromSection: string;
  onSuccess?: (msg: string) => void;
  onError?: (msg: string) => void;
};

export default function MovieCard({ movie, userId, fromSection, onSuccess, onError }: Props) {
  const doLog = async (event_type: "click" | "watch" | "like" | "dislike") => {
    try {
      await logInteraction({
        userId,
        movieId: movie.movieId,
        event_type,
        metadata: { source: fromSection },
      });
      onSuccess?.(`Evento '${event_type}' registrado`);
    } catch (e: any) {
      onError?.(e?.message || "Falha ao registrar evento");
    }
  };

  return (
    <Card variation="outlined" padding="1rem">
      <Flex direction="column" gap="0.25rem">
        <Text fontWeight="700">{movie.title}</Text>
        <Text color="neutral">Gêneros: {movie.genres || "-"}</Text>
        {movie.score && <Text color="neutral">Score: {String(movie.score)} {movie.rank ? `| Rank: ${movie.rank}` : ""}</Text>}
        <Flex gap="0.5rem" wrap="wrap" marginTop="0.5rem">
          <Button size="small" onClick={() => doLog("click")}>Abrir detalhes</Button>
          <Button size="small" variation="primary" onClick={() => doLog("watch")}>Assistir</Button>
          <Button size="small" onClick={() => doLog("like")}>Curtir</Button>
        </Flex>
      </Flex>
    </Card>
  );
}