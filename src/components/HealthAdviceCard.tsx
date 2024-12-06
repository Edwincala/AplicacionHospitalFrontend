import { Button, Card, CardContent, Typography } from "@mui/material";

const HealthAdviceCard: React.FC<{title: string; description: string}> = ({title, description}) => {
  return (
    <Card className="m-4 shadow-lg rounded-lg">
        <CardContent>
            <Typography variant="h5" component="div" className="mb-2">{title}</Typography>
            <Typography variant="body2" color="text.secondary" className="mb-4">{description}</Typography>
            <Button variant="contained" color="primary">Ver más...</Button>
        </CardContent>
    </Card>
  )
}

export default HealthAdviceCard