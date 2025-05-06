import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Switch, StatusBar, ImageBackground,} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const bgImage = { uri: 'https://png.pngtree.com/thumb_back/fh260/background/20220518/pngtree-technology-visualization-futuristic-blue-banner-background-design-image_1367825.jpg' };

export default function App() {
  const [tarefa, setTarefa] = useState('');
  const [lista, setLista] = useState([]);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const dadosSalvos = await AsyncStorage.getItem('tarefas');
        if (dadosSalvos) {
          setLista(JSON.parse(dadosSalvos));
        }
      } catch (error) {
        console.error('Erro ao carregar os dados:', error);
      }
    };
    carregarDados();
  }, []);

  useEffect(() => {
    const salvarDados = async () => {
      try {
        await AsyncStorage.setItem('tarefas', JSON.stringify(lista));
      } catch (error) {
        console.error('Erro ao salvar os dados:', error);
      }
    };
    salvarDados();
  }, [lista]);

  const adicionarTarefa = () => {
    if (tarefa.trim()) {
      const novaTarefa = {
        id: Date.now().toString(),
        texto: tarefa,
        concluida: false,
      };
      setLista([...lista, novaTarefa]);
      setTarefa('');
    }
  };

  const alternarStatus = (id) => {
    const novaLista = lista.map(item =>
      item.id === id ? { ...item, concluida: !item.concluida } : item
    );
    setLista(novaLista);
  };

  const removerTarefa = (id) => {
    const novaLista = lista.filter(item => item.id !== id);
    setLista(novaLista);
  };

  const renderItem = ({ item }) => (
    <View style={styles.taskItem}>
      <Switch
        value={item.concluida}
        onValueChange={() => alternarStatus(item.id)}
        thumbColor={item.concluida ? '#0ff' : '#888'}
        trackColor={{ false: '#333', true: '#0ff' }}
      />
      <Text style={[styles.taskText, item.concluida && styles.textoConcluido]}>
        {item.texto}
      </Text>
      <TouchableOpacity onPress={() => removerTarefa(item.id)}>
        <Text style={styles.botaoRemover}>✖</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ImageBackground source={bgImage} style={styles.background}>
      <View style={styles.container}>
        <StatusBar backgroundColor="#0a0a0a" barStyle="light-content" />
        <Text style={styles.title}>Minha To-do List</Text>

        <View style={styles.areaInput}>
          <TextInput
            style={styles.input}
            placeholder="Digite uma nova tarefa"
            placeholderTextColor="#b0e0ff"
            value={tarefa}
            onChangeText={setTarefa}
          />
          <TouchableOpacity style={styles.button} onPress={adicionarTarefa}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={lista}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          style={{ width: '100%' }}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(0,0,50,0.3)',
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  areaInput: {
    flexDirection: 'row',
    marginBottom: 20,
    width: '100%',
  },
  input: {
    flex: 1,
    height: 45,
    borderColor: '#00e0ff',
    borderWidth: 1,
    borderRadius: 10,
    color: '#ffffff',
    paddingHorizontal: 15,
    backgroundColor: 'rgba(0, 150, 255, 0.2)',
  },
  button: {
    backgroundColor: '#00e0ff',
    borderRadius: 50,
    marginLeft: 10,
    justifyContent: 'center',
    width: 45,
    height: 45,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 10,
  },
  taskText: {
    flex: 1,
    color: '#ffffff',
    fontSize: 18,
    marginLeft: 10,
  },
  textoConcluido: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  botaoRemover: {
    color: '#ff4d4d',
    fontSize: 18,
    marginLeft: 10,
  },
});
