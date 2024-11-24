import { Text, View, StyleSheet, Pressable, ScrollView } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import React from "react";
import { router } from "expo-router";
export default function Index() {
  const [folders, setFolders] = React.useState<string[]>(['favs', 'lols']) // Changed the type to string array
  const [notes, setNotes] = React.useState()
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white'
      }}
    >
      <Navbar />
      <FolderBar folders={folders} />
      <NotesDisplay notes={[]} />
      <View style={{
        position: 'absolute',
        bottom: 8,
        right: 8,
        overflow: 'hidden',
        borderRadius: 40,
      }}>
        <Pressable
          onPress={() => {
            router.push('/write')
          }}
          android_ripple={{ color: 'gray', borderless: true }}
          style={{
            padding: 14,
            backgroundColor: '#333333', // Changed to a very dark shade of gray
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 40,
            gap: 4
          }}>
          <Feather name="edit-2" size={24} color="white" />
          <Text style={{
            color: 'white',
            fontSize: 18,
            fontWeight: '800'
          }}>Compose</Text>
        </Pressable>
      </View>
    </View >
  );
}




const Navbar = () => {
  return (<View style={{
    position: 'fixed',
    padding: 10,
    backgroundColor: "white",
    flexDirection: 'row'
  }}>
    <View
      style={{
        flexDirection: 'row',
        width: '50%',
        padding: 2,
        alignItems: "flex-start",
        justifyContent: "flex-start"
      }}
    >
      <Text style={{
        fontSize: 24,
        fontWeight: '800'
      }}>Notes</Text>
    </View>

    <View style={{
      flexDirection: 'row',
      width: '50%',
      padding: 2,
      alignItems: 'flex-end',
      justifyContent: 'flex-end'
    }}>
      <Pressable style={({ pressed }) => [
        pressed && styles.onPressed
      ]}>
        <Feather name="compass" size={24} color="black" />
      </Pressable>
    </View>
  </View>)
}

interface FolderBarProps {
  folders: string[]; // Adjusted the type to string array
}
const FolderBar: React.FC<FolderBarProps> = ({ folders }) => {
  return (<View style={{
    padding: 10,
  }}>
    <ScrollView horizontal style={{}}>
      {folders.map((folder, index) => (
        <Pressable key={index} style={({ pressed }) => [
          { borderRadius: 24, marginRight: 4, padding: 8, paddingHorizontal: 24, backgroundColor: 'lightgray', flexDirection: 'column', width: 'auto', justifyContent: 'center', alignContent: 'center', alignItems: "center" },
          pressed && styles.onPressed
        ]}>
          <Text style={{
            textAlign: 'center'
          }}>{folder}</Text>
        </Pressable>
      ))}
    </ScrollView>

  </View>)

}
interface NotesDisplayProps {
  notes: [];
}

const NotesDisplay: React.FC<NotesDisplayProps> = ({ notes }) => {
  return (
    <View style={{
      padding: 10
    }}>
      <Pressable style={({ pressed }) => [
        {
          borderColor: 'lightgray',
          borderRadius: 24,
          borderWidth: 1,
          padding: 10,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        },
        pressed && styles.onPressed2
      ]}>
        <Text style={{
          textAlign: 'center',
          fontWeight: '900',
          fontSize: 30,
        }}>The best day of my life</Text>

        <Text style={{
          textAlign: 'center',
          marginTop: 14,
          color: 'gray'
        }}>    I remember waking up to the sun streaming through my window, feeling a sense of excitement I couldn't explain. Every moment of that day was filled with joy, laughter, and unforgettable experiences that I'll cherish forever.
        </Text>
      </Pressable>

    </View>
  );
}


const styles = StyleSheet.create({
  onPressed: {
    opacity: 0.6
  },
  onPressed2: {
    backgroundColor: 'lightgray'
  }
})