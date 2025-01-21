from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password, check_password
from .models import User
from .serializers import UserSerializer

class SignUpView(APIView):
    def post(self, request):
        # Create a mutable copy of request.data
        data = request.data.copy()
        data['password'] = make_password(data['password'])  # Hash the password
        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User created successfully!'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        try:
            user = User.objects.get(username=username)
            if check_password(password, user.password):
                return Response({'message': 'Login successful!'}, status=status.HTTP_200_OK)
            return Response({'error': 'Invalid password.'}, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)



from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

# Load the classification model and tokenizer
MODEL_PATH = "mrm8488/bert-tiny-finetuned-sms-spam-detection"
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")  # Dynamically set device
tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH).to(device)
model.eval()  # Set model to evaluation mode


class ClassifyView(APIView):
    def post(self, request):
        # Extract text from the request
        text = request.data.get("text", "")

        if not text.strip():
            return Response(
                {"error": "Text input is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # Tokenize the input text
            tokens = tokenizer(
                text,
                padding="max_length",
                truncation=True,
                max_length=512,
                return_tensors="pt",
            ).to(device)  # Send tokens to the appropriate device

            # Perform prediction
            with torch.no_grad():
                outputs = model(**tokens)
                logits = outputs.logits
                prediction = torch.argmax(logits, dim=-1).item()

            # Map prediction to label
            id2label = {0: "Not Spam", 1: "Spam"}  # Label mapping for the model
            label = id2label.get(prediction, "Unknown")
            confidence = torch.softmax(logits, dim=-1).max().item()

            return Response(
                {
                    "classification": label,
                    "confidence": float(f"{confidence:.2f}"),  # Ensure two digits after the decimal
                },
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            return Response(
                {
                    "error": "An error occurred during classification.",
                    "details": str(e),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
