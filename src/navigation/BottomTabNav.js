import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Home from "../screens/Home";
import Calendar from "../screens/Calendar";
import Library from "../screens/Library";
import MyPage from "../screens/MyPage";

const BottomTab = createBottomTabNavigator();

const BottomTabNav = () => {
  return (
    <BottomTab.Navigator initialRouteName="Home">
      <BottomTab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name={"home"}
              size={size}
              color={color}
            ></MaterialCommunityIcons>
          ),
        }}
      />
      <BottomTab.Screen
        name="Calendar"
        component={Calendar}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name={"calendar"}
              size={size}
              color={color}
            ></MaterialCommunityIcons>
          ),
        }}
      />
      <BottomTab.Screen
        name="Library"
        component={Library}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name={"dumbbell"}
              size={size}
              color={color}
            ></MaterialCommunityIcons>
          ),
        }}
      />
      <BottomTab.Screen
        name="MyPage"
        component={MyPage}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name={"human-male"}
              size={size}
              color={color}
            ></MaterialCommunityIcons>
          ),
        }}
      />
    </BottomTab.Navigator>
  );
};

export default BottomTabNav;
