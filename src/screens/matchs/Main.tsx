
import React, { useState, useEffect } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import {View,Text,ScrollView,Image,Pressable,TouchableOpacity} from "react-native";
import { RegularButton } from "@components/Buttons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PlayIcon } from "../../components/Icons";
import { MatchsStackParamList } from "@navigation/app/home/matchs/types";
import { API_BASE_URL } from "@env";
import { Header } from "@components/Header";
import { ScreenLoader } from "@components/ScreenLoader";

const Main: React.FC<
  NativeStackScreenProps<MatchsStackParamList, "Matchs/Main">
> = () => {
  const [dates, setDates] = useState<any[]>([]);
  const [matchperdates, setMatchperdates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(true)
  dayjs.locale("fr");
  const insets = useSafeAreaInsets();

  const { navigate } = useNavigation(); 
  const navigateToBuyTicket = (data: any) => {
    navigate("Matchs/MatchsBuyTicket" as never, data as never);
  };
  const getMatchs = () => {
    axios
      .get(`${API_BASE_URL}/matchs`)
      .then((response) => {
        const matchs = response.data;
        setDates(matchs);
        setSelectedDate(matchs[0].id);
      })
      .catch((e) => console.log(e));
  };
  const getMatchPerDate = (date: string, id: number) => {
    axios
      .get(`${API_BASE_URL}/matchs?date=${date}`)
      .then((res) => {
        setMatchperdates(res.data);
        setSelectedDate(id);
        setIsLoading(false)
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getMatchs();
  }, []);
  useEffect(() => {
    if (dates.length > 0) {
      const firstDateId = dates[0].id;
      getMatchPerDate(dates[0].date, firstDateId);
    } else {
      console.log("je");
    }
  }, [dates]);
    if(isLoading){
      return <ScreenLoader/>
    }
  return (
    <View className="flex-1">
     <Header title={"Matchs"}/>
      <View className="flex-1">
        <ScrollView className="">
          <View className="mt-4">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ columnGap: 8, paddingHorizontal: 16}}>
              {/*  affichage des dates */}
              {dates
                .filter(
                  (item, index) =>
                    dates.findIndex((date) => date.date === item.date) === index
                )
                .map((daat: any) => (
                  <TouchableOpacity
                    key={daat.id}
                    activeOpacity={0.7}
                    className={`rounded-full border border-primary px-3 py-[6px] ${
                      daat.id === selectedDate
                        ? "bg-primary"
                        : "bg-transparent"
                    }`}
                    onPress={() => {
                      getMatchPerDate(daat.date, daat.id);
                    }}
                  >
                    <Text
                      className={`font-medium text-primary-orange ${
                        daat.id === selectedDate
                          ? "text-white"
                          : "text-primary"
                      }`}
                    >
                      {dayjs(daat.date).format("ddd D MMM")}
                    </Text>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </View>
          {matchperdates.map((matchperdate: any) => (
            <View
              key={matchperdate.id}
              className="mt-6 items-center"
            >
              <View className="w-96 items-center justify-center rounded-xl bg-white py-4">
                <View className="flex-row">
                  <View className="flex flex-row items-center justify-center">
                    {/* affichage du code pays 1 */}
                    {matchperdate.matchStats.map((stat: any) => {
                      if (
                        stat.team.code == matchperdate.matchStats[0].team.code
                      ) {
                        return (
                          <View
                            className="flex flex-row items-center"
                            key={stat.teamId}
                          >
                            <Text className="font-bold ">{stat.team.code}</Text>
                            <Image
                              source={{ uri: stat.team.flag }}
                              className="ml-3 h-12 w-12 rounded-full"
                            />
                          </View>
                        );
                      }
                    })}
                  </View>
                  <View className="flex w-28 items-center justify-center">
                    {/*les buts des equipes*/}
                    <View className="flex-row ">
                      {matchperdate.matchStats.map(
                        (sta: any, index: number) => {
                          if (sta.goal == matchperdate.matchStats[0].goal) {
                            if (index === 0) {
                              return (
                                <Text
                                  key={sta.teamId}
                                  className="text-xl font-bold text-red-800"
                                >
                                  {sta.goal != null ? sta.goal : "vs"}
                                </Text>
                              );
                            } else return null;
                          }
                        }
                      )}
                      {matchperdate.matchStats.map((st: any) => {
                        if (st.goal !== matchperdate.matchStats[0].goal) {
                          return (
                            <Text
                              key={st.teamId}
                              className="text-xl font-bold text-red-800"
                            >
                              - {st.goal != null ? st.goal : "vs"}
                            </Text>
                          );
                        }
                      })}
                    </View>
                  </View>
                  <View>
                    <View className="flex-row items-center justify-center">
                      {/* affichage du code pays 2 */}
                      {matchperdate.matchStats.map((stat: any) => {
                        if (
                          stat.team.code !==
                          matchperdate.matchStats[0].team.code
                        ) {
                          return (
                            <View
                              className="flex-row items-center"
                              key={stat.teamId}
                            >
                              <View className="mr-3 h-12 w-12 rounded-full border-2 border-gray-100">
                                <Image source={{ uri: stat.team.flag }}className="h-full w-full rounded-full" resizeMode="cover" />
                              </View>

                              <Text className="font-bold">
                                {stat.team.code}
                              </Text>
                            </View>
                          );
                        }
                        return null;
                      })}
                    </View>
                  </View>
                </View>
                <View className="w-28 items-center">
                  <Text className="text-xs">
                    {matchperdate.matchStatus === "over"
                      ? "Terminé"
                      : matchperdate.matchStatus === "next"
                      ? dayjs(matchperdate.time, { locale: "fr" }).format(
                          "h:mm"
                        )
                      : "Direct"}
                  </Text>
                  {matchperdate.matchStatus == "over" ? (
                    <View className="flex-row items-center">
                      <RegularButton px={0} py={0} rounded>
                        <PlayIcon width={20} height={20} fill="#ffffff" />
                      </RegularButton>
                      <Text className="ml-1 text-xs font-bold text-primary-orange">
                        Temps fort
                      </Text>
                    </View>
                  ) : (
                    <View className="">
                      <Pressable
                        onPress={() => navigateToBuyTicket({ matchStats: matchperdate.matchStats, matchsdate: matchperdate.date})}
                        className="mt-5 rounded-full bg-black p-2 px-3"
                      >
                        <Text className="text-[11px] font-bold text-white"> Acheter Ticket</Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};
export { Main };
