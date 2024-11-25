import React from 'react'
import { Pressable, SafeAreaView, View, Text, TextInput, Modal, FlatList } from 'react-native'

import { router } from 'expo-router'
import { Feather } from '@expo/vector-icons'

import { get_all_folder_names, create_note_in_folder } from '@/services/logic'


const Write: React.FC = () => {
    const [modalVisible, setModalVisible] = React.useState(false)
    const [selectedFolder, setSelectedFolder] = React.useState<string | null>(null)
    const [folders, setFolders] = React.useState<string[]>([])
    const [noteTitle, setNoteTitle] = React.useState<string>('')
    const [noteText, setNoteText] = React.useState<string>('')

    const fetchFolders = async () => {
        const folderNames = await get_all_folder_names()
        setFolders(folderNames)
    }
    const HandleSaveNote = async () => {
        if (!noteTitle.trim()) {
            console.log('Error', 'Note title cannot be empty.')
            return
        }

        if (!selectedFolder) {
            console.log('Error', 'Please select a folder.')
            return
        }

        try {
            const noteDate = new Date().toISOString()
            await create_note_in_folder(noteTitle, noteText, noteDate, selectedFolder); // Use proper parameter names
            console.log('Success', 'Note saved successfully.')
            setModalVisible(false)
            router.back()
        } catch (error) {
            console.log('Error', 'Failed to save note. Please try again.')
        }
    }
    return (<SafeAreaView>


        <Pressable onPress={() => {
            router.back()
        }} style={({ pressed }) => [
            {
                backgroundColor: 'lightgray',
                padding: 10,
                paddingHorizontal: 20,
                position: 'absolute',
                top: 4,
                left: 4,
                borderRadius: 24,
            },
            pressed && { opacity: 0.6, }
        ]}>

            <Text style={{
                color: 'black'
            }}>Cancel</Text>
        </Pressable>

        <Pressable
            onPress={() => {
                fetchFolders()
                setModalVisible(true)
            }}
            style={({ pressed }) => [
                {
                    backgroundColor: '#333333',
                    padding: 10,
                    paddingHorizontal: 16,
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    borderRadius: 24,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                },
                pressed && { backgroundColor: '#222222' }
            ]}>

            <Text style={{
                color: 'white'
            }}>Save</Text>
            <Feather name="chevron-down" size={20} color="white" />
        </Pressable>
        <View style={{
            paddingTop: 24,
            paddingHorizontal: 20,
        }}>
            <TextInput
                value={noteTitle} // Set the value to noteTitle state
                onChangeText={setNoteTitle} // Update state on text change
                style={{
                    marginTop: 40,
                    padding: 20,
                    borderRadius: 24,
                    paddingHorizontal: 30,
                    fontSize: 24,
                    fontWeight: '900',
                    borderWidth: 1,
                    borderColor: 'lightgray'
                }} placeholder='Type a title...' />
            <TextInput multiline style={{
                padding: 20,
                marginTop: 20,
                borderRadius: 24,
                paddingHorizontal: 30,
                fontSize: 20,
                height: 400,
                fontWeight: '500',
                borderWidth: 1,
                borderColor: 'lightgray',
                textAlignVertical: 'top'
            }} placeholder='Note your thoughts...'
                value={noteText} onChangeText={setNoteText} />
        </View>


        <FolderSelectModal
            visible={modalVisible}
            folders={folders}
            selectedFolder={selectedFolder}
            onClose={() => setModalVisible(false)}
            onSelectFolder={setSelectedFolder}
            onSave={() => {
                console.log(`Note saved to folder: ${selectedFolder}`)
                HandleSaveNote()
                setModalVisible(false)
                router.back()
            }}
        />


    </SafeAreaView>
    )
}


interface FolderSelectModalProps {
    visible: boolean
    folders: string[]
    selectedFolder: string | null
    onClose: () => void
    onSelectFolder: (folder: string) => void
    onSave: () => void
}

const FolderSelectModal: React.FC<FolderSelectModalProps> = ({
    visible,
    folders,
    selectedFolder,
    onClose,
    onSelectFolder,
    onSave,
}) => {
    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }}
            >
                <View
                    style={{
                        width: '80%',
                        backgroundColor: 'white',
                        borderRadius: 16,
                        padding: 20,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 20,
                            fontWeight: '700',
                            marginBottom: 16,
                        }}
                    >
                        Select Folder
                    </Text>

                    <FlatList
                        data={folders}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <Pressable
                                onPress={() => onSelectFolder(item)}
                                style={{
                                    padding: 12,
                                    marginBottom: 10,
                                    borderRadius: 8,
                                    backgroundColor: selectedFolder === item ? '#007AFF' : '#f0f0f0',
                                }}
                            >
                                <Text
                                    style={{
                                        color: selectedFolder === item ? 'white' : 'black',
                                    }}
                                >
                                    {item}
                                </Text>
                            </Pressable>
                        )}
                    />
                    <Pressable
                        onPress={onSave}
                        style={({ pressed }) => [
                            {
                                marginTop: 16,
                                padding: 12,
                                backgroundColor: '#333333',
                                borderRadius: 8,
                                alignItems: 'center',
                            },
                            pressed && {
                                backgroundColor: '#222222'
                            }
                        ]}
                    >
                        <Text
                            style={{
                                color: 'white',
                                fontWeight: '700',
                            }}
                        >
                            Save
                        </Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    )
}



export default Write