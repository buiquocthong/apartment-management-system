import { StyleSheet } from "react-native";
import theme from "../assets/theme/theme";
import color from "../assets/theme/colors";

export const styles = StyleSheet.create({
  inputError: {
    borderColor: "#ff0000",
    borderWidth: 1,
  },
  errorText: {
    color: "#ff0000",
    fontSize: 12,
    marginTop: -12,
    marginBottom: 8,
  },
  infoContainer: {
    backgroundColor: color.white,
    borderRadius: 8,
    padding: 16,
    marginTop: 15,
    marginBottom: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    paddingBottom: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontFamily: theme.fonts.semiBold,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontFamily: theme.fonts.regular,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
  },
  button: {
    backgroundColor: color.blue,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    margin: 15,
  },
  buttonText: {
    color: color.white,
    fontSize: 18,
    fontFamily: theme.fonts.bold,
  },
});