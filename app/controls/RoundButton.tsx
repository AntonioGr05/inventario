import React from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';

type Props = {
  title: string;
};

const RoundButton = ({title}: Props): React.JSX.Element => {
  return (
    <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'blue',
    borderRadius: 20,
    padding: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default RoundButton;
