"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/dashboard-layout";
import { Star, Sparkles, ExternalLink, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Review {
  id: number;
  author: string;
  authorPhoto: string | null;
  rating: number;
  text: string;
  date: string;
  reply?: string;
}

const mockReviews: Review[] = [
  {
    id: 1,
    author: "Marie Dupont",
    authorPhoto: null,
    rating: 5,
    text: "Excellente entreprise ! Travail soigné et dans les délais. L'équipe est très professionnelle et à l'écoute. Je recommande vivement pour vos travaux de rénovation.",
    date: "2024-01-15",
  },
  {
    id: 2,
    author: "Jean Martin",
    authorPhoto: null,
    rating: 5,
    text: "Très satisfait de la rénovation de ma cuisine. Le résultat est magnifique et correspond parfaitement à mes attentes. Merci !",
    date: "2024-01-12",
  },
  {
    id: 3,
    author: "Sophie Bernard",
    authorPhoto: null,
    rating: 4,
    text: "Bon travail dans l'ensemble. Quelques petits retards mais la qualité est au rendez-vous. L'équipe est sympathique.",
    date: "2024-01-10",
  },
  {
    id: 4,
    author: "Pierre Lefebvre",
    authorPhoto: null,
    rating: 5,
    text: "Rénovation complète de ma salle de bain. Travail impeccable, équipe pro et respectueuse. Je recommande !",
    date: "2024-01-08",
  },
  {
    id: 5,
    author: "Claire Dubois",
    authorPhoto: null,
    rating: 5,
    text: "Extension de maison réalisée avec brio. Les finitions sont parfaites et le chantier a été propre. Très contente du résultat final.",
    date: "2024-01-05",
  },
  {
    id: 6,
    author: "Thomas Rousseau",
    authorPhoto: null,
    rating: 4,
    text: "Bonne prestation pour mes travaux d'isolation. Quelques ajustements ont été nécessaires mais l'équipe a été réactive.",
    date: "2024-01-03",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-5 h-5 ${
            star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review, onCreatePost }: { review: Review; onCreatePost: (review: Review) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start gap-4 mb-4">
            {review.authorPhoto ? (
              <img
                src={review.authorPhoto}
                alt={review.author}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                {review.author.charAt(0)}
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{review.author}</h3>
                <Badge variant="outline" className="text-xs">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(review.date).toLocaleDateString("fr-FR")}
                </Badge>
              </div>
              <StarRating rating={review.rating} />
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{review.text}</p>

          {review.reply && (
            <div className="bg-muted p-4 rounded-lg mb-4">
              <p className="text-xs font-semibold mb-2">Réponse de l'entreprise</p>
              <p className="text-sm text-muted-foreground">{review.reply}</p>
            </div>
          )}

          <Button
            onClick={() => onCreatePost(review)}
            className="w-full"
            variant="default"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Créer une publication avec cet avis
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function GeneratedPostModal({
  isOpen,
  onClose,
  review,
}: {
  isOpen: boolean;
  onClose: () => void;
  review: Review | null;
}) {
  if (!review) return null;

  const generatedText = `✨ Un grand merci à ${review.author} pour cet avis ! ✨\n\n"${review.text}"\n\n${
    review.rating === 5 ? "⭐⭐⭐⭐⭐" : "⭐".repeat(review.rating)
  }\n\nVotre satisfaction est notre priorité ! Merci de nous faire confiance pour vos projets de rénovation.\n\n#Témoignage #Avis #Rénovation #Chantier #Satisfaction`;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Publication générée</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-8 rounded-xl border-2 border-primary/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                {review.author.charAt(0)}
              </div>
              <div>
                <p className="font-semibold">{review.author}</p>
                <StarRating rating={review.rating} />
              </div>
            </div>

            <div className="bg-white/50 p-6 rounded-lg mb-4">
              <p className="text-sm italic text-muted-foreground">"{review.text}"</p>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{new Date(review.date).toLocaleDateString("fr-FR")}</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold mb-2 block">Texte de la publication</label>
            <textarea
              className="w-full p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              rows={10}
              defaultValue={generatedText}
            />
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Modifier
            </Button>
            <Button className="flex-1">
              <Sparkles className="w-4 h-4 mr-2" />
              Publier maintenant
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ReviewsPage() {
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleCreatePost = (review: Review) => {
    setSelectedReview(review);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedReview(null);
  };

  const averageRating = (
    mockReviews.reduce((acc, review) => acc + review.rating, 0) / mockReviews.length
  ).toFixed(1);

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: mockReviews.filter((r) => r.rating === rating).length,
  }));

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 space-y-6">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Note moyenne
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="text-4xl font-bold">{averageRating}</div>
                <div>
                  <StarRating rating={Math.round(parseFloat(averageRating))} />
                  <p className="text-xs text-muted-foreground mt-1">
                    {mockReviews.length} avis
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Distribution des notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {ratingDistribution.map(({ rating, count }) => (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-20">
                      <span className="text-sm font-medium">{rating}</span>
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400"
                        style={{
                          width: `${(count / mockReviews.length) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-8">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold">Avis Google My Business</h2>
              <p className="text-sm text-muted-foreground">
                Transformez vos avis en publications engageantes
              </p>
            </div>
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              Voir sur Google
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockReviews.map((review) => (
              <ReviewCard key={review.id} review={review} onCreatePost={handleCreatePost} />
            ))}
          </div>
        </section>
      </div>

      <GeneratedPostModal
        isOpen={showModal}
        onClose={handleCloseModal}
        review={selectedReview}
      />
    </DashboardLayout>
  );
}
