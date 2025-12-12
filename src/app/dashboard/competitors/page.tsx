"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DashboardLayout from "@/components/dashboard-layout";
import {
  Users,
  Calendar,
  Target,
  BarChart3,
  ExternalLink,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface CompetitorAccount {
  id: number;
  name: string;
  username: string;
  profileImage: string;
  postsThisMonth: number;
  postsThisYear: number;
  url: string;
}

const mockInstagramAccounts: CompetitorAccount[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `Concurrent Instagram ${i + 1}`,
  username: `concurrent_${i + 1}`,
  profileImage: `https://api.dicebear.com/7.x/initials/svg?seed=IG${i + 1}`,
  postsThisMonth: Math.floor(Math.random() * 20) + 5,
  postsThisYear: Math.floor(Math.random() * 200) + 50,
  url: `https://instagram.com/concurrent_${i + 1}`,
}));

const mockFacebookAccounts: CompetitorAccount[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `Concurrent Facebook ${i + 1}`,
  username: `ConcurrentFB${i + 1}`,
  profileImage: `https://api.dicebear.com/7.x/initials/svg?seed=FB${i + 1}`,
  postsThisMonth: Math.floor(Math.random() * 15) + 3,
  postsThisYear: Math.floor(Math.random() * 180) + 40,
  url: `https://facebook.com/ConcurrentFB${i + 1}`,
}));

const mockLinkedInAccounts: CompetitorAccount[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `Concurrent LinkedIn ${i + 1}`,
  username: `concurrent-linkedin-${i + 1}`,
  profileImage: `https://api.dicebear.com/7.x/initials/svg?seed=LI${i + 1}`,
  postsThisMonth: Math.floor(Math.random() * 12) + 2,
  postsThisYear: Math.floor(Math.random() * 150) + 30,
  url: `https://linkedin.com/company/concurrent-linkedin-${i + 1}`,
}));

export default function CompetitorsPage() {
  const [activeTab, setActiveTab] = useState("moyenne");

  const avgPostsThisWeek = 8;
  const avgPostsThisMonth = 12;
  const ourPostsThisWeek = 5;
  const ourPostsThisMonth = 18;

  const competitorsAvgWeek = Math.round(
    [...mockInstagramAccounts, ...mockFacebookAccounts, ...mockLinkedInAccounts]
      .reduce((acc, c) => acc + c.postsThisMonth, 0) / 60 / 4
  );
  const competitorsAvgMonth = Math.round(
    [...mockInstagramAccounts, ...mockFacebookAccounts, ...mockLinkedInAccounts]
      .reduce((acc, c) => acc + c.postsThisMonth, 0) / 60
  );

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analyse Concurrence</h1>
            <p className="text-muted-foreground mt-1">Suivez les performances de vos concurrents</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="moyenne">Moyenne</TabsTrigger>
            <TabsTrigger value="instagram">Instagram</TabsTrigger>
            <TabsTrigger value="facebook">Facebook</TabsTrigger>
            <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
          </TabsList>

          <TabsContent value="moyenne" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Moyenne cette semaine
                  </CardTitle>
                  <CardDescription>Publications de tous les concurrents</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold mb-2">{competitorsAvgWeek}</div>
                  <p className="text-sm text-muted-foreground">publications/semaine en moyenne</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Moyenne ce mois-ci
                  </CardTitle>
                  <CardDescription>Publications de tous les concurrents</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold mb-2">{competitorsAvgMonth}</div>
                  <p className="text-sm text-muted-foreground">publications/mois en moyenne</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Comparaison avec vos publications
                </CardTitle>
                <CardDescription>Comparez vos performances avec la moyenne des concurrents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Cette semaine</span>
                      <span className="text-xs text-muted-foreground">Vous vs Concurrents</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="text-2xl font-bold text-primary">{ourPostsThisWeek}</div>
                        <p className="text-xs text-muted-foreground">Vos publications</p>
                      </div>
                      <div className="text-2xl font-bold text-muted-foreground">vs</div>
                      <div className="flex-1">
                        <div className="text-2xl font-bold">{competitorsAvgWeek}</div>
                        <p className="text-xs text-muted-foreground">Moyenne concurrents</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {ourPostsThisWeek > competitorsAvgWeek ? (
                        <>
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          <span className="text-green-500 font-medium">
                            +{ourPostsThisWeek - competitorsAvgWeek} au-dessus de la moyenne
                          </span>
                        </>
                      ) : (
                        <>
                          <TrendingDown className="w-4 h-4 text-red-500" />
                          <span className="text-red-500 font-medium">
                            {competitorsAvgWeek - ourPostsThisWeek} en-dessous de la moyenne
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Ce mois-ci</span>
                      <span className="text-xs text-muted-foreground">Vous vs Concurrents</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="text-2xl font-bold text-primary">{ourPostsThisMonth}</div>
                        <p className="text-xs text-muted-foreground">Vos publications</p>
                      </div>
                      <div className="text-2xl font-bold text-muted-foreground">vs</div>
                      <div className="flex-1">
                        <div className="text-2xl font-bold">{competitorsAvgMonth}</div>
                        <p className="text-xs text-muted-foreground">Moyenne concurrents</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {ourPostsThisMonth > competitorsAvgMonth ? (
                        <>
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          <span className="text-green-500 font-medium">
                            +{ourPostsThisMonth - competitorsAvgMonth} au-dessus de la moyenne
                          </span>
                        </>
                      ) : (
                        <>
                          <TrendingDown className="w-4 h-4 text-red-500" />
                          <span className="text-red-500 font-medium">
                            {competitorsAvgMonth - ourPostsThisMonth} en-dessous de la moyenne
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="instagram" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">📸</span>
                  Comptes Instagram suivis
                </CardTitle>
                <CardDescription>20 comptes concurrents sur Instagram</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockInstagramAccounts.map((account) => (
                    <div
                      key={account.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={account.profileImage} alt={account.name} />
                          <AvatarFallback>{account.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-semibold">{account.name}</div>
                          <div className="text-sm text-muted-foreground">@{account.username}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="text-lg font-bold">{account.postsThisMonth}</div>
                          <div className="text-xs text-muted-foreground">Ce mois</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold">{account.postsThisYear}</div>
                          <div className="text-xs text-muted-foreground">Cette année</div>
                        </div>
                        <a
                          href={account.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary hover:underline text-sm"
                        >
                          Voir
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="facebook" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">👥</span>
                  Comptes Facebook suivis
                </CardTitle>
                <CardDescription>20 comptes concurrents sur Facebook</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockFacebookAccounts.map((account) => (
                    <div
                      key={account.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={account.profileImage} alt={account.name} />
                          <AvatarFallback>{account.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-semibold">{account.name}</div>
                          <div className="text-sm text-muted-foreground">{account.username}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="text-lg font-bold">{account.postsThisMonth}</div>
                          <div className="text-xs text-muted-foreground">Ce mois</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold">{account.postsThisYear}</div>
                          <div className="text-xs text-muted-foreground">Cette année</div>
                        </div>
                        <a
                          href={account.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary hover:underline text-sm"
                        >
                          Voir
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="linkedin" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">💼</span>
                  Comptes LinkedIn suivis
                </CardTitle>
                <CardDescription>20 comptes concurrents sur LinkedIn</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockLinkedInAccounts.map((account) => (
                    <div
                      key={account.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={account.profileImage} alt={account.name} />
                          <AvatarFallback>{account.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-semibold">{account.name}</div>
                          <div className="text-sm text-muted-foreground">{account.username}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="text-lg font-bold">{account.postsThisMonth}</div>
                          <div className="text-xs text-muted-foreground">Ce mois</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold">{account.postsThisYear}</div>
                          <div className="text-xs text-muted-foreground">Cette année</div>
                        </div>
                        <a
                          href={account.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary hover:underline text-sm"
                        >
                          Voir
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}